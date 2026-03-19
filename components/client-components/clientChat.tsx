"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import { getMessages, sendMessage } from "@/app/actions/messages";
import pusherClient from "@/lib/pusher-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea }   from "@/components/ui/textarea";
import { Button }     from "@/components/ui/button";
import { Badge }      from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SendHorizonal, Loader2, MessageSquareDashed } from "lucide-react";
import { useClientDashboard } from "@/app/store/clientStore";

export enum Sender {
  freelancer = "freelancer",
  client = "client"
}

export interface Message {
  id: string;
  content: string;
  sender: Sender;
  taskId: string;
  createdAt: any; 
  updatedAt: any; 
}

interface ChatWindowProps {
  senderRole?: Sender;
}

export default function ClientChat({ senderRole = Sender.client }: ChatWindowProps) {

  const {
    selectedTask,
    taskChats,
    setTaskMessages,
    appendMessage,
    replaceOptimisticMessage,
    removeMessage,
    setTaskLoading,
  } = useClientDashboard();

  const [input,   setInput]   = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const taskId    = selectedTask?.id ?? null;
  const chatSlice = taskId ? (taskChats[taskId] ?? { messages: [], isLoading: false }) : null;
  const messages  = chatSlice?.messages  ?? [];
  const isLoading = chatSlice?.isLoading ?? false;

  useEffect(() => {
    if (!taskId) return;
    setTaskMessages(taskId, []);
    setTaskLoading(taskId, true);

    //Fetch messages from database
    getMessages(taskId).then((res) => {
      if (res.success && res.data) {
        setTaskMessages(taskId, res.data);
      } else {
        setTaskLoading(taskId, false);
      }
    });
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;
    const channel = pusherClient.subscribe(`task-${taskId}`);
    channel.bind("new-message", (incomingMessage: Message) => {
      const current =
        useClientDashboard.getState().taskChats[taskId]?.messages ?? [];

      const alreadyExists = current.some((m) => m.id === incomingMessage.id);
      if (alreadyExists) return;

      const optimistic = current.find(
        (m) =>
          m.id.startsWith("optimistic-") &&
          m.content === incomingMessage.content &&
          m.sender  === incomingMessage.sender
      );

      if (optimistic) {
        useClientDashboard
          .getState()
          .replaceOptimisticMessage(taskId, optimistic.id, incomingMessage);
      } else {
        useClientDashboard.getState().appendMessage(taskId, incomingMessage);
      }
    });
    return () => {
      pusherClient.unsubscribe(`task-${taskId}`);
    };
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // send message 
  const handleSend = useCallback(async () => {
    if (!taskId || !input.trim() || sending) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    // Optimistic message — shown instantly before the server responds
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: Message = {
      id:        optimisticId,
      content,
      sender:    senderRole,
      taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    appendMessage(taskId, optimisticMsg);

    // save to database 
    const res = await sendMessage(taskId, content, senderRole);

    if (res.success && res.data) {
      replaceOptimisticMessage(taskId, optimisticId, res.data);
    } else {
      removeMessage(taskId, optimisticId);
    }

    setSending(false);
  }, [taskId, input, sending, senderRole, appendMessage, replaceOptimisticMessage, removeMessage]);

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

//  blank render without taskid 
  if (!selectedTask) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <MessageSquareDashed className="h-10 w-10 opacity-30" />
        <p className="text-sm">Select a task to view its chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{selectedTask.title}</p>
          <p className="text-xs capitalize text-muted-foreground">
            {selectedTask.status.replace(/_/g, " ")}
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs capitalize">
          {senderRole}
        </Badge>
      </div>

      {/* MESSAGES */}
      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <MessageSquareDashed className="mb-2 h-8 w-8 opacity-25" />
            <p className="text-xs">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-4 mr-4">
            {messages.map((msg) => {
              const isOwn        = msg.sender === senderRole;
              const isOptimistic = msg.id.startsWith("optimistic-");

              return (
                <div
                  key={msg.id}
                  className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm transition-opacity",
                      isOwn
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted text-foreground",
                      isOptimistic && "opacity-60" // dimmed while saving
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={cn(
                      "mt-1 text-right text-[10px]",
                      isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {isOptimistic
                        ? "Sending…"
                        : new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit", minute: "2-digit",
                          })
                      }
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* INPUT BAR */}
      <div className="shrink-0 border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            className="max-h-32 min-h-[2.5rem] resize-none text-sm"
            rows={1}
            disabled={sending}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0"
          >
            {sending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <SendHorizonal className="h-4 w-4" />
            }
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
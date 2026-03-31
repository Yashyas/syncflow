import { Message, Task } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClientSessionState {
  project: Record<string, any> | null;
  setProject: (project: Record<string, any>) => void;
  clearProject: () => void;
}

export const useClientSessionStore = create<ClientSessionState>()(
  persist(
    (set) => ({
      project: null,
      setProject: (project) => set({ project }),
      clearProject: () => set({ project: null }),
    }),
    {
      name: "client_project",
    }
  )
);

// client dashboard store 

// interface extended for message count 
interface TaskWithCount extends Task{
  _count?:{
    messages:number;
  }
}
interface MessageSlice {
  messages: Message[];
  isLoading: boolean;
}

export enum ClientView {
  DASHBOARD = "DASHBOARD",
  CHAT = "CHAT",
  IDEAS = "IDEAS",
}


interface ClientDashboard {
  // task array client dashboard 
  tasks: TaskWithCount[];
  setTasks: (tasks: TaskWithCount[]) => void;

  // selected task
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;   

    //Current dashboard view
    clientDashboardView: ClientView;
    setClientDashboardView: (view: ClientView) => void;

      //Chat window
    
      taskChats: Record<string, MessageSlice>;
      //   initial message set for a task
      setTaskMessages: (taskId: string, messages: Message[]) => void;
      //   new message appended in store
      appendMessage: (taskId: string, message: Message) => void;
      // replace the message with the one that came
      replaceOptimisticMessage: (
        taskId: string,
        optimisticId: string,
        real: Message,
      ) => void;
    
      // removeMessage — used to ROLL BACK an optimistic message if the API call fails.
      removeMessage: (taskId: string, messageId: string) => void;
      // setTaskLoading — toggles the loading spinner for a specific task's chat.
      setTaskLoading: (taskId: string, loading: boolean) => void;
}

export const useClientDashboard = create<ClientDashboard>((set) => ({
    // task array client dashboard 
    tasks: [],
    setTasks: (tasks) => set({ tasks }),

    //Selected task
    selectedTask: null,
    setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

    //Current dashboard view
    clientDashboardView: ClientView.DASHBOARD,
    setClientDashboardView: (view: ClientView) =>
    set({ clientDashboardView: view }), 
    
      // ── 13. Chat window

  taskChats: {},

  setTaskMessages: (taskId, messages) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: { messages, isLoading: false },
      },
    })),

  // appendMessage
  appendMessage: (taskId, message) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: [
            ...(state.taskChats[taskId]?.messages ?? []), // existing messages or empty array
            message, // new message goes at the END
          ],
        },
      },
    })),

  replaceOptimisticMessage: (taskId, optimisticId, real) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: (state.taskChats[taskId]?.messages ?? []).map((m) =>
            m.id === optimisticId ? real : m,
          ),
        },
      },
    })),

  removeMessage: (taskId, messageId) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          isLoading: state.taskChats[taskId]?.isLoading ?? false,
          messages: (state.taskChats[taskId]?.messages ?? []).filter(
            (m) => m.id !== messageId,
          ),
        },
      },
    })),

  setTaskLoading: (taskId, loading) =>
    set((state) => ({
      taskChats: {
        ...state.taskChats,
        [taskId]: {
          messages: state.taskChats[taskId]?.messages ?? [],
          isLoading: loading,
        },
      },
    })),

}))
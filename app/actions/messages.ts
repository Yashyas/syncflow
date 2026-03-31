"use server"
import { prisma } from "@/lib/prisma";  
import pusherServer from "@/lib/pusher-server";
import { Sender } from "@prisma/client";


export async function getMessages(taskId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "asc", 
      },
    });

    return { success: true as const, data: messages };

  } catch (error) {
    console.error("[getMessages] Failed to fetch messages:", error);
    return { success: false as const, error: "Failed to load messages." };
  }
}

// sendMessage

export async function sendMessage(
  taskId: string,
  content: string,
  sender: Sender
) {

  if (!content.trim()) {
    return { success: false as const, error: "Message content cannot be empty." };
  }

  try {
    const message = await prisma.message.create({
      data: {
        taskId,
        content: content.trim(), 
        sender,
      },
    });
//  pusher 
    await pusherServer.trigger(`task-${taskId}`, "new-message", message);

    return { success: true as const, data: message };

  } catch (error) {
    console.error("[sendMessage] Failed:", error);
    return { success: false as const, error: "Failed to send message." };
  }
}
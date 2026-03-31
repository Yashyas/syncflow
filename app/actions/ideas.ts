"use server";

import {prisma} from "@/lib/prisma";
import { IdeaType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ── Shared auth helper ──────────────────────────────────────────────────────
async function verifyProjectAccess(projectId: string, sharingPassword: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, sharingPassword: true },
  });

  if (!project) return { error: "Project not found" };
  if (!project.sharingPassword) return { error: "Project has no sharing password set" };

  if (!(sharingPassword === project.sharingPassword)) return { error: "Invalid password" };

  return { project };
}

// ── Get all ideas for a project ─────────────────────────────────────────────
export async function getIdeas(projectId: string, sharingPassword: string) {
  const auth = await verifyProjectAccess(projectId, sharingPassword);
  if (auth.error) return { error: auth.error };

  const ideas = await prisma.idea.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return { ideas };
}

// ── Add a text or URL idea ──────────────────────────────────────────────────
export async function addTextOrUrlIdea(
  projectId: string,
  sharingPassword: string,
  type: "TEXT" | "URL",
  content: string,
  caption?: string
) {
  const auth = await verifyProjectAccess(projectId, sharingPassword);
  if (auth.error) return { error: auth.error };

  if (!content.trim()) return { error: "Content cannot be empty" };

  const idea = await prisma.idea.create({
    data: {
      type: type as IdeaType,
      content: content.trim(),
      caption: caption?.trim() || null,
      projectId,
    },
  });

  return { idea };
}

// ── Add an image idea (URL already uploaded to UploadThing) ─────────────────
export async function addImageIdea(
  projectId: string,
  sharingPassword: string,
  imageUrl: string,
  caption?: string
) {
  const auth = await verifyProjectAccess(projectId, sharingPassword);
  if (auth.error) return { error: auth.error };

  const idea = await prisma.idea.create({
    data: {
      type: IdeaType.IMAGE,
      content: imageUrl,
      caption: caption?.trim() || null,
      projectId,
    },
  });

  return { idea };
}

// ── Delete an idea (only needs projectId + password, no user auth) ──────────
export async function deleteIdea(
  ideaId: string,
  projectId: string,
  sharingPassword: string
) {
  const auth = await verifyProjectAccess(projectId, sharingPassword);
  if (auth.error) return { error: auth.error };

  // Make sure the idea actually belongs to this project
  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, projectId },
  });

  if (!idea) return { error: "Idea not found" };

  await prisma.idea.delete({ where: { id: ideaId } });
  return { success: true };
}
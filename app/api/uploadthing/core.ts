import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";


const f = createUploadthing();

export const ourFileRouter = {
  ideaImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    // 👇 input schema — frontend passes projectId + plain-text password
    .input(
      z.object({
        projectId: z.string(),
        sharingPassword: z.string(),
      })
    )
    // 👇 middleware runs on the server before the upload is allowed
    .middleware(async ({ input }) => {
       if (!input.projectId || !input.sharingPassword) throw new Error("Invalid project")
      return {project: input.projectId}
      
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // You can optionally auto-create the Idea record here,
      // but we'll do it in the server action for consistency
      console.log("Upload complete for project:", metadata.projectId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.projectId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
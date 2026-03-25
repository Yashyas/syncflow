"use client";

import { useState, useEffect, useCallback } from "react";
import { Idea } from "@/lib/generated/prisma/client";
import { getIdeas, addTextOrUrlIdea, addImageIdea, deleteIdea } from "@/app/actions/ideas";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Trash2,
  Link2,
  Type,
  ImagePlus,
  ExternalLink,
  Plus,
  Upload,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
type UploadTab = "TEXT" | "URL" | "IMAGE";

interface IdeasPageProps {
  projectId: string;
  sharingPassword: string; // plain-text password (already validated by the page/cookie)
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function IdeasPage({ projectId, sharingPassword }: IdeasPageProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<UploadTab>("TEXT");

  // Form state
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ── UploadThing hook ──
  const { startUpload } = useUploadThing("ideaImageUploader", {
    onClientUploadComplete: (res) => {
      // This fires after upload + onUploadComplete server callback
      console.log("Client upload done:", res);
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  // ── Fetch ideas on mount ──
  const fetchIdeas = useCallback(async () => {
    setIsFetching(true);
    const result = await getIdeas(projectId, sharingPassword);
    if (result.error) {
      toast.error(result.error);
    } else {
      setIdeas(result.ideas ?? []);
    }
    setIsFetching(false);
  }, [projectId, sharingPassword]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // ── Submit text or URL ──
  async function handleTextOrUrlSubmit() {
    const content = activeTab === "TEXT" ? textContent : urlContent;
    if (!content.trim()) return toast.error("Please enter something first");

    // Basic URL validation
    if (activeTab === "URL") {
      try { new URL(content); } catch {
        return toast.error("Please enter a valid URL (include https://)");
      }
    }

    setIsSubmitting(true);
    const result = await addTextOrUrlIdea(
      projectId,
      sharingPassword,
      activeTab as "TEXT" | "URL",
      content,
      caption
    );

    if (result.error) {
      toast.error(result.error);
    } else if (result.idea) {
      setIdeas((prev) => [result.idea!, ...prev]);
      setTextContent("");
      setUrlContent("");
      setCaption("");
      toast.success("Idea added!");
    }
    setIsSubmitting(false);
  }

  // ── Submit image ──
  async function handleImageSubmit() {
    if (!selectedFile) return toast.error("Please select an image first");

    setIsUploading(true);

    // Pass projectId + sharingPassword as UploadThing input (goes to middleware)
    const uploadResult = await startUpload([selectedFile], {
      projectId,
      sharingPassword,
    });

    if (!uploadResult || uploadResult.length === 0) {
      setIsUploading(false);
      return toast.error("Upload failed, please try again");
    }

    const imageUrl = uploadResult[0].url;

    // Save to DB via server action
    const result = await addImageIdea(projectId, sharingPassword, imageUrl, imageCaption);

    if (result.error) {
      toast.error(result.error);
    } else if (result.idea) {
      setIdeas((prev) => [result.idea!, ...prev]);
      setSelectedFile(null);
      setImageCaption("");
      toast.success("Image idea added!");
    }
    setIsUploading(false);
  }

  // ── Delete idea ──
  async function handleDelete(ideaId: string) {
    // Optimistic removal
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));

    const result = await deleteIdea(ideaId, projectId, sharingPassword);
    if (result.error) {
      toast.error(result.error);
      fetchIdeas(); // rollback by refetching
    } else {
      toast.success("Idea removed");
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ideas Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drop text snippets, reference URLs, or inspiration images here.
        </p>
      </div>

      {/* ── Upload Panel ── */}
      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UploadTab)} >
            <TabsList className="w-full ">
              <TabsTrigger value="TEXT" className="flex-1 gap-2">
                <Type className="size-4 " /> Text
              </TabsTrigger>
              <TabsTrigger value="URL" className="flex-1 gap-2">
                <Link2 className="size-4" /> URL
              </TabsTrigger>
              <TabsTrigger value="IMAGE" className="flex-1 gap-2">
                <ImagePlus className="size-4" /> Image
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "TEXT" && (
            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Write your idea, note, or thought..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <Input
                placeholder="Caption (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          )}

          {activeTab === "URL" && (
            <div className="flex flex-col gap-3">
              <Input
                placeholder="https://example.com/inspiration"
                value={urlContent}
                onChange={(e) => setUrlContent(e.target.value)}
                type="url"
              />
              <Input
                placeholder="Caption (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          )}

          {activeTab === "IMAGE" && (
            <div className="flex flex-col gap-3">
              {/* File drop zone */}
              <label
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
                  "cursor-pointer p-8 transition-colors hover:bg-muted/50",
                  selectedFile && "border-primary bg-primary/5"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="size-8 text-muted-foreground" />
                {selectedFile ? (
                  <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click to select an image (max 8MB)
                  </p>
                )}
              </label>
              <Input
                placeholder="Caption (optional)"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end border-t pt-4">
          <Button
            onClick={activeTab === "IMAGE" ? handleImageSubmit : handleTextOrUrlSubmit}
            disabled={isSubmitting || isUploading}
            className="gap-2"
          >
            {isSubmitting || isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {isUploading ? "Uploading..." : "Add Idea"}
          </Button>
        </CardFooter>
      </Card>

      {/* ── Ideas Grid ── */}
      {isFetching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <ImagePlus className="size-12 mb-3 opacity-20" />
          <p className="text-sm">No ideas yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onDelete={() => handleDelete(idea.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Idea Card ───────────────────────────────────────────────────────────────
function IdeaCard({ idea, onDelete }: { idea: Idea; onDelete: () => void }) {
  return (
    <Card className="break-inside-avoid overflow-hidden group">
      {/* Image */}
      {idea.type === "IMAGE" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={idea.content}
          alt={idea.caption ?? "Idea image"}
          className="w-full object-cover"
        />
      )}

      <CardContent className="p-3 flex flex-col gap-2">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("text-xs gap-1", {
              "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300":
                idea.type === "URL",
              "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300":
                idea.type === "TEXT",
              "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300":
                idea.type === "IMAGE",
            })}
          >
            {idea.type === "URL" && <Link2 className="size-3" />}
            {idea.type === "TEXT" && <Type className="size-3" />}
            {idea.type === "IMAGE" && <ImagePlus className="size-3" />}
            {idea.type}
          </Badge>

          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {/* Content */}
        {idea.type === "TEXT" && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{idea.content}</p>
        )}

        {idea.type === "URL" && (
          <a
            href={idea.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center gap-1 hover:underline truncate"
          >
            <ExternalLink className="size-3 shrink-0" />
            <span className="truncate">{idea.content}</span>
          </a>
        )}

        {/* Caption for image/url */}
        {idea.caption && (
          <p className="text-xs text-muted-foreground">{idea.caption}</p>
        )}

        <p className="text-xs text-muted-foreground/60 mt-1">
          {new Date(idea.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
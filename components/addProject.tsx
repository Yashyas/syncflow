"use client"
import { createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import React, { useState } from "react";

interface AddProjectProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddProject({open, onOpenChange}: AddProjectProps) {
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const result = await createProject(formData);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
      return
    }
    toast.success(result?.message || "Project created successfully");
    onOpenChange(false);

  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new project.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue="Project Title" />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue="Project Description" />
            </Field>
            <Field>
              <Label htmlFor="client">Client</Label>
              <Input id="client" name="client" defaultValue="Client " />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  );
}

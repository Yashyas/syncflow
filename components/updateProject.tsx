"use client"
import {updateTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import React, { useState } from "react";
import { useDashboardStore } from "@/app/store/dashboardStore";
import { Textarea } from "./ui/textarea";
import { updateProject } from "@/app/actions/projects";



export default function UpdateProjectDrawer() {
    const [loading, setLoading] = useState(false);

    // No.8. from zustand store to toggle add task drawer 
    const isUpdateProjectDrawerOpen = useDashboardStore((state) => state.isUpdateProjectDrawerOpen)
    const toggleUpdateProjectDrawer = useDashboardStore((state) => state.toggleUpdateProjectDrawer)
    const setSelectedProject = useDashboardStore((state) => state.setSelectedProject)

    const selectedProject = useDashboardStore((state)=> state.selectedProject)

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        if(!selectedProject){
            toast.error("Error creating task")
            return
        }
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string
        }
        const result = await updateProject(selectedProject,data);

        setLoading(false);
        if (result?.error) {
            toast.error(result.error);
            return
        }
        if(result && result.updatedProject){
            setSelectedProject(result.updatedProject)
        }
        
        
        toast.success(result?.message || "Task updated successfully");
        toggleUpdateProjectDrawer();
        

    }
    return (
        <Dialog open={isUpdateProjectDrawerOpen} onOpenChange={toggleUpdateProjectDrawer}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Fill in the details to edit this project.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={selectedProject?.title} />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={selectedProject?.description ?? "" } />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Client</Label>
                            <Textarea id="description" name="description" defaultValue={selectedProject?.client ?? "" } />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Sharing Password</Label>
                            <Textarea id="description" name="description" defaultValue={selectedProject?.sharingPassword ?? "" } />
                        </Field>
                        
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    );
}

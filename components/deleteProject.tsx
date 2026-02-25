"use client"
import { createProject, deleteProject } from "@/app/actions/projects";
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
import { useDashboardStore } from "@/app/store/dashboardStore";

export default function DeleteProject() {
    const [loading, setLoading] = useState(false);
    //  No.2 from zustand store to get selected project for deletion  
    const selectedProject = useDashboardStore((state) => state.selectedProject)

    // No.1 from zustand to select different project after DeleteIcon. 
    const toggleProjectSelectionDrawer = useDashboardStore((state) => state.toggleProjectSelectionDrawer)
    // No.4. from zustand store to toggle delete project drawer 
    const isDeleteProjectDrawerOpen = useDashboardStore((state) => state.isDeleteProjectDrawerOpen)
    const toggleDeleteProjectDrawer = useDashboardStore((state) => state.toggleDeleteProjectDrawer)

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);

        if (!selectedProject) {
            toast.error("No project selected for deletion");
            setLoading(false);
            return;
        }
        if (selectedProject.title !== formData.get("title") || selectedProject.client !== formData.get("client")) {
            toast.error("Project details do not match");
            setLoading(false);
            return;
        }
        try {
            const result = await deleteProject(selectedProject.id);
            setLoading(false);
            toast.success(result?.message || "Project deleted successfully");
            toggleDeleteProjectDrawer();
            toggleProjectSelectionDrawer();

        } catch (error) {
            toast.error("Failed to delete project");
        }


    }
    return (
        <Dialog open={isDeleteProjectDrawerOpen} onOpenChange={toggleDeleteProjectDrawer}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
                        <DialogDescription className="text-red-600">
                            This action cannot be undone !!
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-8">
                        <Field>
                            <Label htmlFor="title">Write the Project Title :- "{selectedProject?.title}" to delete it.</Label>
                            <Input id="title" name="title" placeholder="Project Title" />
                        </Field>

                        <Field>
                            <Label htmlFor="client">Write the Project Client :- "{selectedProject?.client}" to delete it.</Label>
                            <Input id="client" name="client" placeholder="Client " />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button variant={"destructive"} type="submit" disabled={loading}>
                            {loading ? "Deleting..." : "Yes, delete project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    );
}

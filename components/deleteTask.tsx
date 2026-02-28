"use client"
import { deleteTask } from "@/app/actions/tasks";
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

export default function DeleteTask() {
    const [loading, setLoading] = useState(false);
    //  from zustand store to get selected task for deletion  
    const selectedTask = useDashboardStore((state) => state.selectedTask)

    // from zustand store to toggle delete task drawer 
    const isDeleteTaskDrawerOpen = useDashboardStore((state) => state.isDeleteTaskDrawerOpen)
    const toggleDeleteTaskDrawer = useDashboardStore((state) => state.toggleDeleteTaskDrawer)

    const removeTask = useDashboardStore((state) => state.removeTask)

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);

        try {
            if(!selectedTask) return null
            const result = await deleteTask(selectedTask);
            setLoading(false);
            toast.success(result?.message || "Project deleted successfully");
            toggleDeleteTaskDrawer();
            // delete task from zustand store 
            removeTask(selectedTask.id)

        } catch (error) {
            toast.error("Failed to delete project");
        }


    }
    return (
        <Dialog open={isDeleteTaskDrawerOpen} onOpenChange={toggleDeleteTaskDrawer}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                        <DialogDescription className="text-red-600">
                            This action cannot be undone !!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant={"destructive"} type="submit" disabled={loading}>
                            {loading ? "Deleting..." : "Yes, delete task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    );
}

"use client"
import { createProject, createTask } from "@/app/actions/projects";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface AddTaskProps {
    onSuccess?: () => void
}

export default function AddTask({ onSuccess }: AddTaskProps) {
    const [loading, setLoading] = useState(false);

    // No.3. from zustand store to toggle add project drawer 
    const isAddTaskDrawerOpen = useDashboardStore((state) => state.isAddTaskDrawerOpen)
    const toggleAddTaskDrawer = useDashboardStore((state) => state.toggleAddTaskDrawer)

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
        toast.success(result?.message || "Task created successfully");
        toggleAddTaskDrawer();
        onSuccess?.();

    }
    return (
        <Dialog open={isAddTaskDrawerOpen} onOpenChange={toggleAddTaskDrawer}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new task in this project.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="Task Title" />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" placeholder="Task Description" />
                        </Field>
                        
                    </FieldGroup>

                    <RadioGroup defaultValue="pending" name="status" className="w-fit mt-4">
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="pending" id="r1" />
                            <Label htmlFor="r1">Pending</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="in_progress" id="r2" />
                            <Label htmlFor="r2">In Progress</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="for_verification" id="r2" />
                            <Label htmlFor="r2">For Review</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="completed" id="r3" />
                            <Label htmlFor="r3">Completed</Label>
                        </div>
                    </RadioGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Add Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    );
}

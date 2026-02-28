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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Task } from "@/lib/generated/prisma/client";
import { Textarea } from "./ui/textarea";
import { title } from "process";


export default function UpdateTask() {
    const [loading, setLoading] = useState(false);

    // No.8. from zustand store to toggle add task drawer 
    const isUpdateTaskDrawerOpen = useDashboardStore((state) => state.isUpdateTaskDrawerOpen)
    const toggleUpdateTaskDrawer = useDashboardStore((state) => state.toggleUpdateTaskDrawer)
    const editedTask = useDashboardStore((state) => state.updateTask)

    const selectedTask = useDashboardStore((state)=> state.selectedTask)

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        if(!selectedTask){
            toast.error("Error creating task")
            return
        }
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string
        }
        const result = await updateTask(selectedTask,data);

        setLoading(false);
        if (result?.error) {
            toast.error(result.error);
            return
        }
        if(result && result.updatedTask){
            editedTask(result.updatedTask)
        }
        
        
        toast.success(result?.message || "Task updated successfully");
        toggleUpdateTaskDrawer();
        

    }
    return (
        <Dialog open={isUpdateTaskDrawerOpen} onOpenChange={toggleUpdateTaskDrawer}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                            Fill in the details to edit this task.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={selectedTask?.title} />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={selectedTask?.description ?? "" } />
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

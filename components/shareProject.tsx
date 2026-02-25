"use client"

import { useDashboardStore } from "@/app/store/dashboardStore"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Check } from "lucide-react" // Icons for better UX
import { useState } from "react"
import { toast } from "sonner"

export function ShareProject() {
    const selectedProject = useDashboardStore((state) => state.selectedProject)
    const isShareProjectDrawerOpen = useDashboardStore((state) => state.isShareProjectDrawerOpen)
    const toggleShareProjectDrawer = useDashboardStore((state) => state.toggleShareProjectDrawer)

    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!selectedProject) return;

        // Construct the message for the client
        const shareText = `
SyncFlow Project Access
-----------------------
Project: ${selectedProject.title}
Client: ${selectedProject.client}
Project ID: ${selectedProject.id}
Sharing Password: ${selectedProject.sharingPassword}
        `.trim();

        try {
            await navigator.clipboard.writeText(shareText)
            setCopied(true)
            toast.success("Project details copied to clipboard!")

            // Reset the icon back to "Copy" after 2 seconds
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy text")
        }
    }

    return (
        <Dialog open={isShareProjectDrawerOpen} onOpenChange={toggleShareProjectDrawer}>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Project With Client</DialogTitle>
                    <DialogDescription className="pt-2">
                        Please share the following details with <span className="font-bold text-foreground">{selectedProject?.client}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted p-4 rounded-lg border text-sm font-mono space-y-2 my-4">
                    <p><span className="text-muted-foreground">Project Id:</span> {selectedProject?.id}</p>
                    <p><span className="text-muted-foreground">Password:</span> {selectedProject?.sharingPassword}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button onClick={handleCopy} className="w-full flex gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Full Details"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}
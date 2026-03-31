"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, MessageSquare, Lightbulb, CheckCircle2,
  FileText, Bell, BarChart2, CalendarCheck,
  Users, ClipboardList, ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getClientProject } from "@/app/actions/client-actions"; 
import { useClientSessionStore } from "../store/clientStore";
import { toast } from "sonner";

export default function ClientLoginPage() {
  const router = useRouter();
  const { setProject , project } =useClientSessionStore();

  const [projectIdInput, setProjectIdInput] = useState("");
  const [sharingPassword, setSharingPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (project) {
      router.replace(`/client-dashboard/`);
    }
  }, [project]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getClientProject(projectIdInput.trim(), sharingPassword);
      if ("error" in result) {
        toast.error(result.error)
        return;
      }
      setProject(result.project);
      router.push(`/client-dashboard/`);
    } catch {
      toast.error("Failed to connect to server")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  h-screen w-full bg-background overflow-hidden">
         {/* Left Side */}
      <div className="flex sticky h-screen w-full items-center justify-center p-8 lg:w-2/5">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-none sm:border sm:shadow-sm">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">Client Access</CardTitle>
              <CardDescription>
                Enter your Project ID and Sharing Password to view your
                dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    type="text"
                    placeholder="e.g. 507f1f77bcf86cd799439011"
                    value={projectIdInput}
                    onChange={(e) => setProjectIdInput(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sharingPassword">Sharing Password</Label>
                  <Input
                    id="sharingPassword"
                    type="password"
                    placeholder="••••••••"
                    value={sharingPassword}
                    onChange={(e) => setSharingPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col text-center">
              <p className="text-sm text-muted-foreground mt-4">
                Lost your credentials? Please reach out to your project manager.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden w-3/5 flex-col overflow-y-auto border-r bg-muted/30 p-12 lg:flex xl:p-24">
  <div className="mx-auto  flex max-w-xl flex-col gap-8 pt-8">

    {/* Hero */}
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
        ✦ Powered by SyncFlow
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Welcome to Your Project Portal
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        SyncFlow gives you a front-row seat to everything happening on your
        project — real-time, transparent, and beautifully organized.
      </p>
    </div>

    {/* Divider */}
    <div className="h-px bg-border" />

    {/* Core features */}
    <div className="grid gap-8">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Live Progress Tracking</h3>
          <p className="mt-2 text-muted-foreground">
            View your project's dashboard to see exactly what stage we are in.
            Track completed milestones and upcoming deliverables with zero
            guesswork.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Centralized Messaging</h3>
          <p className="mt-2 text-muted-foreground">
            Communicate with the team directly on the dashboard, or leave
            specific feedback on individual tasks to keep context perfectly
            clear.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Share Ideas & Assets</h3>
          <p className="mt-2 text-muted-foreground">
            Use the dedicated Ideas page to drop inspiration, share snapshots,
            and collaborate on the vision without cluttering the main timeline.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Recent Activity Tracking</h3>
          <p className="mt-2 text-muted-foreground">
            Get notified the moment a milestone is hit. You always have the complete picture of what is going on.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Task-Level Visibility</h3>
          <p className="mt-2 text-muted-foreground">
            Drill down into individual tasks to see their status, assignee, and
            completion percentage. You're never in the dark about what's
            actually being worked on.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Approval Workflows</h3>
          <p className="mt-2 text-muted-foreground">
            Review and approve deliverables directly in the portal. No
            back-and-forth emails — just a clean approve or request-revision
            flow that keeps things moving.
          </p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-border" />

    {/* Stats strip */}
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="rounded-xl bg-background border p-4">
        <p className="text-2xl font-bold text-foreground">100%</p>
        <p className="text-xs text-muted-foreground mt-1">Transparent tracking</p>
      </div>
      <div className="rounded-xl bg-background border p-4">
        <p className="text-2xl font-bold text-foreground">24/7</p>
        <p className="text-xs text-muted-foreground mt-1">Portal availability</p>
      </div>
      <div className="rounded-xl bg-background border p-4">
        <p className="text-2xl font-bold text-foreground">0</p>
        <p className="text-xs text-muted-foreground mt-1">Surprise changes</p>
      </div>
    </div>

    {/* Security callout */}
    <div className="rounded-xl bg-primary/5 p-6 border border-primary/10">
      <h4 className="flex items-center gap-2 font-medium text-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        Read-Only Security
      </h4>
      <p className="mt-2 text-sm text-muted-foreground">
        Your portal is completely safe. You have full visibility into the
        project timeline without the risk of accidentally modifying core project
        data. All access is logged and session-protected.
      </p>
    </div>

    {/* Testimonial-style quote */}
    <div className="rounded-xl bg-background border p-6">
      <p className="text-sm text-muted-foreground italic leading-relaxed">
        "Having the SyncFlow portal meant I always knew exactly where things
        stood. I stopped chasing updates — they came to me."
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          A
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">A Previous Client</p>
          <p className="text-xs text-muted-foreground">SyncFlow Portal User</p>
        </div>
      </div>
    </div>

    {/* Footer note */}
    <p className="text-xs text-muted-foreground text-center pb-8">
      SyncFlow — Built to keep clients informed, every step of the way.
    </p>

  </div>
</div>


    </div>
  );
}
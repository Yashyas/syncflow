import Comp from "@/components/comp";
import HeroSection from "@/components/heroSection";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreeCards } from "@/components/threeCards";
import { VerticalCarousel } from "@/components/verticalCaresoul";
import { authOptions } from "@/lib/auth";
import {
  ActivityIcon,
  Bell,
  ClipboardList,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Activity } from "react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <HeroSection />
      <ThreeCards />
      <VerticalCarousel />
      <div className="my-8 p-4 md:p-8 flex-col justify-center">
        <div className="grid gap-8 justify-center">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
              <ActivityIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Live Progress Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                View your project's dashboard to see exactly what stage we are
                in. Track completed milestones and upcoming deliverables with
                zero guesswork.
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
                Use the dedicated Ideas page to drop inspiration, share
                snapshots, and collaborate on the vision without cluttering the
                main timeline.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                Recent Activity Tracking
              </h3>
              <p className="mt-2 text-muted-foreground">
                Get notified the moment a milestone is hit. You always have the
                complete picture of what is going on.
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
                Drill down into individual tasks to see their status, assignee,
                and completion percentage. You're never in the dark about what's
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
        {/* comp component  */}
        <div className="p-4 md:p-8 mt-16">
          <Comp />
        </div>
        {/* cards  */}
        <div className="grid grid-cols-3 gap-4 mt-16 text-center">
          <div className="rounded-xl bg-background border p-4">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Transparent tracking
            </p>
          </div>
          <div className="rounded-xl bg-background border p-4">
            <p className="text-2xl font-bold text-primary">24/7</p>
            <p className="text-xs text-muted-foreground mt-1">
              Portal availability
            </p>
          </div>
          <div className="rounded-xl bg-background border p-4">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-muted-foreground mt-1">
              Surprise changes
            </p>
          </div>
        </div>
        {/* client testimony */}
        <div className="rounded-xl bg-background border mt-16 p-6">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "Having the SyncFlow portal meant I always knew exactly where things
            stood. I stopped chasing updates — they came to me."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                A Previous Client
              </p>
              <p className="text-xs text-muted-foreground">
                SyncFlow Portal User
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 pb-8">
        SyncFlow — Built to keep clients informed, every step of the way.
      </p>
    </div>
  );
}

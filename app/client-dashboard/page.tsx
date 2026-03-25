"use client"
import { TaskTable } from "@/components/client-components/taskTable";
import { useClientSessionStore } from "../store/clientStore";
import TaskDonutChart from "@/components/client-components/taskDonutChart";
import ProjectCompletion from "@/components/client-components/projectCompletion";
import RecentActivity from "@/components/client-components/recentActivity";
import ClientProjectCard from "@/components/client-components/clientProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitySquare, Lightbulb, ListTodo } from "lucide-react";
import IdeasPage from "@/components/IdeaPage";
import { redirect } from "next/navigation";


export default function ClientDashboard() {
  const { clearProject , project } =useClientSessionStore();
  console.log(project)
  if (!project){
    redirect("/client")
  }
  return (
    <div>
      <div className="text-center p-2 text-2xl border-2 bg-primary text-background"><p>Client Dashboard</p></div>
        <div className="flex flex-col md:flex-row justify-around gap-4 p-4">
          <TaskDonutChart/>
          <ProjectCompletion/>
          <ClientProjectCard/>
        </div>
        <div className="p-4">
          <Tabs
      defaultValue="tasks"
      className="flex w-full flex-col"
    >
      {/* ── Tab bar ── */}
      <TabsList className="h-11 w-fit rounded-xl bg-muted/60 px-1 backdrop-blur-sm">
      <TabsTrigger
          value="tasks"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <ListTodo className="h-4 w-4" />
          Tasks
        </TabsTrigger>

        <TabsTrigger
          value="activity"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <ActivitySquare className="h-4 w-4" />
          Recent Activity
        </TabsTrigger>
 
        <TabsTrigger
          value="ideas"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          <Lightbulb className="h-4 w-4" />
          Ideas
        </TabsTrigger>
      </TabsList>
 
      {/* ── Tab panels — each takes remaining viewport height ── */}
      <TabsContent
        value="activity"
        className="mt-4 flex-1 outline-none ring-0 focus-visible:ring-0"
      >
        <RecentActivity />
      </TabsContent>
 
      <TabsContent
        value="tasks"
        className="mt-4 flex-1 outline-none ring-0 focus-visible:ring-0"
      >
        <TaskTable />
      </TabsContent>
 
      <TabsContent
        value="ideas"
        className="mt-4 flex-1 outline-none ring-0 focus-visible:ring-0"
      >
        <IdeasPage projectId={project!.id}
              sharingPassword={project!.sharingPassword}/>
      </TabsContent>
    </Tabs>
  
        </div>
      
    </div>
    
  )
}

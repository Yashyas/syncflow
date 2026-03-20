"use client"
import { TaskTable } from "@/components/client-components/taskTable";
import { useClientSessionStore } from "../store/clientStore";
import TaskDonutChart from "@/components/client-components/taskDonutChart";
import ProjectCompletion from "@/components/client-components/projectCompletion";
import RecentActivity from "@/components/client-components/recentActivity";
import ClientProjectCard from "@/components/client-components/clientProjectCard";


export default function ClientDashboard() {
  const { clearProject , project } =useClientSessionStore();
  console.log(project)
  return (
    <div>
        <div className="flex flex-col md:flex-row justify-around gap-4 p-4">
          <TaskDonutChart/>
          <ProjectCompletion/>
          <ClientProjectCard/>
        </div>
        <div className="p-4">
          <RecentActivity/>
          <TaskTable/>
        </div>
      
    </div>
    
  )
}

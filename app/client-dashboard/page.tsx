"use client"
import { TaskTable } from "@/components/client-components/taskTable";
import { useClientSessionStore } from "../store/clientStore";
import TaskDonutChart from "@/components/client-components/taskDonutChart";


export default function ClientDashboard() {
  const { clearProject , project } =useClientSessionStore();
  console.log(project)
  return (
    <div>
      <div>
        <TaskDonutChart/>
      </div>
      <TaskTable/>
    </div>
    
  )
}

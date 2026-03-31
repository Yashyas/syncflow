import { getClientProjectTaskData } from "@/app/actions/client-actions"
import { ClientView, useClientDashboard, useClientSessionStore } from "@/app/store/clientStore"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Task } from "@prisma/client"
import { BadgeCheck, Eye, Loader, MessageSquareText, Pickaxe } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { MessageDrawer } from "./messageDrawer"

interface TaskWithCount extends Task{
  _count?:{
    messages:number;
  }
}
    

export function TaskTable() {

    const { clearProject , project } =useClientSessionStore();
    const tasks = useClientDashboard((state)=> state.tasks)
    const setTasks = useClientDashboard((state)=> state.setTasks)
    const setSelectedTask = useClientDashboard((state)=>state.setSelectedTask)
    const setClientDashboardView = useClientDashboard((state) => state.setClientDashboardView)

    // fetch tasks and set tasks 
        useEffect(()=>{
        if(!project?.id) return
        fetchTasks()
    },[])

    async function fetchTasks(){
        // fetch tasks from server 
        if(!project?.id || !project?.sharingPassword){
            return
        }
        const data =await getClientProjectTaskData(project.id,project.sharingPassword)
        
        if(data.error){
            toast.error(data.error)
            return
        }
        setTasks(data.tasksData?.tasks ?? [])
        console.log(tasks)
    }
    const renderStatusBadge = (status: string) => {
          switch (status) {
            case "pending":
            return <Badge variant="destructive" className="">
                <Loader/>
                Pending
                </Badge>;
            case "in_progress":
            return <Badge variant="default" className="">
                <Pickaxe/>
                In Progress
                </Badge>;
            case "for_verification":
            return <Badge variant="outline" className="">
                <Eye/>
                For Review
                </Badge>;
            case "completed":
            return <Badge variant="default" className="bg-green-500">
                <BadgeCheck/>
                Completed
                </Badge>;
            default:
            // Fallback for unknown statuses
            return <Badge variant="outline">{status}</Badge>;
         }
    }

    function handleChat(task :TaskWithCount){
        setSelectedTask(task)
        setClientDashboardView(ClientView.CHAT)
        console.log(task)
      }

    

  return (
    <div className="my-4 ">
   <Table className="border-2 p-2 rounded-2xl">
  <TableHeader className="bg-primary ">
    <TableRow>
      <TableHead className="w-[100px] text-primary-foreground">Task</TableHead>

      <TableHead className="w-[300px] text-primary-foreground">Description</TableHead>
      <TableHead className="text-primary-foreground">Status</TableHead>
      <TableHead className="text-right text-primary-foreground ">Messages</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {tasks
      .filter((task) => task.status !== "central_chat" && task.status !== "scraped")
      .map((task) => (
        <TableRow key={task.id}>
          <TableCell className="font-medium align-top py-4">{task.title}</TableCell>
          
          <TableCell className="w-[50vw] align-top">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={task.id} className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline text-left">
                  <span className="truncate">
                    {(task.description ?? "").length > 25
                      ? `${(task.description ?? "").substring(0, 25)}...`
                      : task.description}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="whitespace-normal break-words leading-relaxed text-muted-foreground pb-4">
                  {task.description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TableCell>

          <TableCell className="align-top py-4">
            {renderStatusBadge(task.status)}
          </TableCell>
          <TableCell className="text-right align-top py-4">
            <div 
              className="relative hover:text-primary hover:rotate-12 ease-in-out cursor-pointer inline-flex" 
              onClick={() =>handleChat(task as TaskWithCount)}
            >
              <MessageDrawer><MessageSquareText/></MessageDrawer>
              {(task._count?.messages ?? 0) > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {(task._count?.messages ?? 0) > 99
                    ? "99+"
                    : task._count?.messages}
                </Badge>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
  </TableBody>
</Table>
</div>
  )
}

import { Task } from "@prisma/client";
import {useDraggable} from '@dnd-kit/core'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { MessageSquareText, SquarePen, Trash2 } from "lucide-react";
import { CurrentView, useDashboardStore } from "@/app/store/dashboardStore";
import UpdateTask from "../updateTask";
import { Badge } from "../ui/badge";

interface TaskWithCount extends Task{
  _count?:{
    messages:number;
  }
}
interface KanbanCardProps {
    task: TaskWithCount
    overlay? : boolean
}

export default function KanbanCard({task , overlay = false} : KanbanCardProps){
    const {setNodeRef,listeners,attributes,isDragging} = useDraggable({
        id: task.id,
    })
      const toggleUpdateTaskDrawer = useDashboardStore((state) => state.toggleUpdateTaskDrawer)
      const setSelectedTask = useDashboardStore((state)=>state.setSelectedTask)
       const toggleDeleteTaskDrawer = useDashboardStore((state) => state.toggleDeleteTaskDrawer)
       const setCurrentDashboardView = useDashboardStore((state) => state.setCurrentDashboardView)
      
       const messageCount = task._count?.messages ?? 0

      function handleClick(){ 
        setSelectedTask(task)
        toggleUpdateTaskDrawer()
      }

      function handleDelete(){
        setSelectedTask(task)
        toggleDeleteTaskDrawer()
      }

      function handleChat(){
        setSelectedTask(task)
        setCurrentDashboardView(CurrentView.CHAT)
      }

    return(
        <>
             
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab active:cursor-grabbing my-2 w-full py-4 hover:bg-accent transition-all ${isDragging && !overlay ? 'opacity-40 border border-ring shadow' : 'opacity-100'} ${overlay ? 'rotate-2 scale-105':''}`}
            >
            <CardHeader className="">
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent className=" h-full -my-4">
                <p><span className="text-primary">Description : </span>{task.description}</p>
            </CardContent>
            <CardFooter className=" flex gap-2 justify-end">
                
                <Trash2 className="mr-auto hover:text-destructive hover:rotate-12 ease-in-out" onClick={handleDelete}/>
                <SquarePen onClick={handleClick} className="hover:text-primary hover:rotate-12 ease-in-out"/>
                <div className="relative hover:text-primary hover:rotate-12 ease-in-out" onClick={handleChat}>
                    <MessageSquareText />
                    {messageCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                            {messageCount > 99 ? '99+' : messageCount}
                        </Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
        </>
    )
}
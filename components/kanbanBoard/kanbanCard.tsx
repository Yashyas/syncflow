import { Task } from "@/lib/generated/prisma/client";
import {useDraggable} from '@dnd-kit/core'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { MessageSquareText, SquarePen, Trash2 } from "lucide-react";
import { useDashboardStore } from "@/app/store/dashboardStore";
import UpdateTask from "../updateTask";

interface KanbanCardProps {
    task: Task
    overlay? : boolean
}

export default function KanbanCard({task , overlay = false} : KanbanCardProps){
    const {setNodeRef,listeners,attributes,isDragging} = useDraggable({
        id: task.id,
    })
      const toggleUpdateTaskDrawer = useDashboardStore((state) => state.toggleUpdateTaskDrawer)
      const setSelectedTask = useDashboardStore((state)=>state.setSelectedTask)
       const toggleDeleteTaskDrawer = useDashboardStore((state) => state.toggleDeleteTaskDrawer)
      

      function handleClick(){
        setSelectedTask(task)
        toggleUpdateTaskDrawer()
      }

      function handleDelete(){
        setSelectedTask(task)
        toggleDeleteTaskDrawer()
      }

    return(
        <>
             
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab active:cursor-grabbing my-2 w-full py-4 transition-all ${isDragging && !overlay ? 'opacity-40 border border-ring shadow' : 'opacity-100'} ${overlay ? 'rotate-2 scale-105':''}`}
            >
            <CardHeader className="">
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent className=" h-full -my-4">
                <p><span className="text-primary">Description : </span>{task.description}</p>
            </CardContent>
            <CardFooter className=" flex gap-2 justify-end">
                <Trash2 onClick={handleDelete}/>
                <SquarePen onClick={handleClick}/>
                <MessageSquareText/>
            </CardFooter>
        </Card>
        </>
    )
}
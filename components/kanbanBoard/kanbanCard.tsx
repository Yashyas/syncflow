import { Task } from "@/lib/generated/prisma/client";
import {useDraggable} from '@dnd-kit/core'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { MessageSquareText } from "lucide-react";
import { Separator } from "react-resizable-panels";

export default function KanbanCard({task}:{task :Task}){
    const {setNodeRef,listeners,attributes,isDragging} = useDraggable({
        id: task.id,
    })

    return(
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab active:cursor-grabbing my-2 w-full py-4 transition-opacity ${isDragging ? 'opacity-40 border border-ring shadow' : 'opacity-100'}`}
            >
            <CardHeader className="">
                <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent className=" h-full -my-4">
                <p><span className="text-primary">Description : </span>{task.description}</p>
            </CardContent>
            <CardFooter className=" -my-2 flex justify-end">
                
                <MessageSquareText/>
            </CardFooter>
        </Card>
    )
}
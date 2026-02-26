import { Task } from "@/lib/generated/prisma/client"
import { TaskStatus } from "@/lib/generated/prisma/enums"
import { useDroppable } from "@dnd-kit/core"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import KanbanCard from "./kanbanCard"
import { Button } from "../ui/button"
import { CirclePlus } from "lucide-react"

interface KanbanColumnProps{
    id: TaskStatus
    label: string
    tasks: Task[]
}
export default function KanbanColumn({id,label,tasks}: KanbanColumnProps) {
        const {setNodeRef,isOver} =useDroppable({id})
  return (
    <div className="flex flex-col w-full h-[90vh] ">
      <div className="flex justify-center ">
        <div className="border-2 bg-primary py-1 px-2 rounded">{label}</div>
        </div>
      <Separator/>
      <ScrollArea className="h-full ">
            <div ref={setNodeRef} className="border-2 border-ring h-full min-h-[87vh] items-center  p-4 flex flex-col ">
                {tasks.map((task) =>(
                    <KanbanCard key={task.id} task={task}/>
                ))}
                {tasks.length === 0 && (
                    <div className="border-2 flex-1 w-full flex flex-col gap-4 items-center justify-center">
                        <p>No tasks</p>
                        <Button><CirclePlus/>Add Task</Button>
                    </div>
                    
                )}
            </div>
      </ScrollArea>
    </div>
  )
}

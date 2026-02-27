import { Task } from "@/lib/generated/prisma/client"
import { TaskStatus } from "@/lib/generated/prisma/enums"
import { useDroppable } from "@dnd-kit/core"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import KanbanCard from "./kanbanCard"
import { Button } from "../ui/button"
import { CirclePlus } from "lucide-react"
import { useDashboardStore } from "@/app/store/dashboardStore"

interface KanbanColumnProps{
    id: TaskStatus
    label: string
    tasks: Task[]
}
export default function KanbanColumn({id,label,tasks}: KanbanColumnProps) {
        const {setNodeRef,isOver} =useDroppable({id})
        const toggleAddTaskDrawer = useDashboardStore((state) => state.toggleAddTaskDrawer)
  return (
    <div className="flex flex-col p-2 w-full h-[90vh]  ">
      <div className="flex justify-center mb-1 ">
        <div className="bg-primary py-1 px-2 rounded">{label}</div>
        </div>
      {/* <Separator/> */}
      <div className="h-auto w-90 lg:w-full ">
            <div ref={setNodeRef} className={`border-2 border-ring
              ${isOver ? "border-solid border-4":""} border-dashed rounded h-full min-h-[80vh] items-center  p-4 flex flex-col`}>
                {tasks.map((task) =>(
                    <KanbanCard key={task.id} task={task}/>
                ))}
                {tasks.length === 0 && (
                    <div className="flex-1 w-full flex flex-col gap-4 items-center justify-center" onClick={toggleAddTaskDrawer}>
                        <p>No tasks</p>
                        <Button><CirclePlus/>Add Task</Button>
                    </div>
                    
                )}
            </div>
      </div>
    </div>
  )
}

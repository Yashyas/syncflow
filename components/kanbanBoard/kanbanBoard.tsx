import { TaskStatus } from '@/lib/generated/prisma/enums'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import {useState} from 'react'
import { COLUMNS } from './constants'
import KanbanColumn from './kanbanColumn'
import { Task } from '@/lib/generated/prisma/client'
import KanbanCard from './kanbanCard'
import AddTask from '../addTask'

export default function KanbanBoard() {
    const fetchedTasks = [
        {
            id: "tid",
            title: "task1",
            description: "helo",
            status: TaskStatus.completed,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid2",
            title: "task12",
            description: "helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid3",
            title: "task12",
            description: "helo helo v helo helo helohelo helo helo helo helo helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid4",
            title: "task12",
            description: "helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid5",
            title: "task15",
            description: "helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid6",
            title: "task16",
            description: "helo helo v helo helo helohelo helo helo helo helo helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
        {
            id: "tid7",
            title: "task17",
            description: "helo",
            status: TaskStatus.in_progress,
            projectId: "pid",
            createdAt : new Date(),
            updatedAt : new Date(),
            message:[]
        },
    ]
    const [tasks, setTasks] = (useState<Task[]>(fetchedTasks))
    const [activeTask,setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(TouchSensor,{
            activationConstraint:{
                delay: 250,
                tolerance: 5,
            }
        }),
        useSensor(MouseSensor,{
            activationConstraint:{
                distance: 8
            }
        })
    )

    async function fetchTasks(){
        // fetch tasks from server 
    }

    function handleDragStart(event:DragStartEvent){
        const task = tasks.find((t)=> t.id === event.active.id)
        if (task) setActiveTask(task)
    }

    async function handleDragEnd(event:DragEndEvent) {
        const {active,over} = event
        setActiveTask(null)

        if(!over || active.id === over.id) return

        const taskId = active.id as string
        const newStatus = over.id as TaskStatus

        setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? {...t,status: newStatus} : t))
        )

        // update task status in sever 
        console.log(`Staus updated of ${taskId} and current status: ${newStatus}`)
    }
    return (
        <>
        <AddTask onSuccess={fetchTasks}/>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} >
            <div className='flex gap-1  overflow-x-scroll overflow-y-scroll no-scrollbar'>
                {COLUMNS.map((col) => (
                    <KanbanColumn
                    key={col.id}
                    id={col.id}
                    label={col.label}
                    tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
                
            </div>

            <DragOverlay>
                {activeTask && <KanbanCard task={activeTask} overlay/>}
            </DragOverlay>
        </DndContext>
        </>
    )
}

import { TaskStatus } from '@/lib/generated/prisma/enums'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import {useState} from 'react'
import { COLUMNS } from './constants'
import KanbanColumn from './kanbanColumn'
import { Task } from '@/lib/generated/prisma/client'

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
    ]
    const [tasks, setTasks] = (useState<Task[]>(fetchedTasks))

    async function handleDragEnd(event:DragEndEvent) {
        const {active,over} = event
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
        <DndContext onDragEnd={handleDragEnd}>
            <div className='flex '>
                {COLUMNS.map((col) => (
                    <KanbanColumn
                    key={col.id}
                    id={col.id}
                    label={col.label}
                    tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
            </div>
        </DndContext>
    )
}

import { TaskStatus } from '@/lib/generated/prisma/enums'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import {useEffect, useState} from 'react'
import { COLUMNS } from './constants'
import KanbanColumn from './kanbanColumn'
import { Task } from '@/lib/generated/prisma/client'
import KanbanCard from './kanbanCard'
import AddTask from '../addTask'
import { getProjectTaskData, updateTask } from '@/app/actions/tasks'
import { useDashboardStore } from '@/app/store/dashboardStore'
import { toast } from 'sonner'
import UpdateTask from '../updateTask'
import DeleteTask from '../deleteTask'

export default function KanbanBoard() {
    
    // 7. from zustand store task array 
    const tasks = useDashboardStore((state)=> state.tasks)
    const setTasks = useDashboardStore((state)=> state.setTasks)
    const editedTask = useDashboardStore((state)=> state.updateTask)

    const selectedProject = useDashboardStore((state)=> state.selectedProject)
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

    useEffect(()=>{
        if(!selectedProject?.id) return
        fetchTasks()
    },[selectedProject?.id])

    async function fetchTasks(){
        // fetch tasks from server 
        if(!selectedProject?.id || !selectedProject?.sharingPassword){
            return
        }
        const data =await getProjectTaskData(selectedProject.id,selectedProject.sharingPassword)
        
        if(data.error){
            toast.error(data.error)
            return
        }
        console.log("Fetch task ran")
        setTasks(data.tasksData?.tasks ?? [])
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

        const taskToUpdate = tasks.find((t)=> t.id === taskId);
        if(taskToUpdate){
            editedTask({...taskToUpdate,status: newStatus})

            // update task status in sever 
        try {
            console.log(`Staus updated of ${taskId} and current status: ${newStatus}`)    
            updateTask(taskToUpdate,{status:newStatus})
        } catch (error) {
            toast.error("Network error. Reverting...")
            editedTask(taskToUpdate)
        }
        }

    }
    return (
        <>
        <AddTask />
        <UpdateTask/> 
        <DeleteTask/>
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

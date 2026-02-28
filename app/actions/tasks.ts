"use server"
import { authOptions } from "@/lib/auth"
import { Project, Task } from "@/lib/generated/prisma/client"
import { TaskStatus } from "@/lib/generated/prisma/enums"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { title } from "process"

export async function createTask(formData: FormData, project:Project){
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id){
        redirect("/api/auth/login")   
    }
    
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as TaskStatus

    if(!title ) return {error:"Title is required"}

    try {
        const projectExists = await prisma.project.findFirst({
            where: {
                id: project.id,
                freelancerId: session.user.id,
            }
        })
        if (!projectExists) {
            return { error: "Project not found" }
        }

        const exisistingTask = await prisma.task.findFirst({
            where: {
                title,
                projectId: project.id,
            }
        })
        if (exisistingTask) {
            return { error: "Task with this title already exists for this client" }
        }
        
        const task = await prisma.task.create({
            data:{
                title,
                description,
                status,
                projectId : project.id,
            }
        })
        if (task) {
            return {message: "Task created successfully",task}   
        }

    } catch (error) {
        return {error: "Failed to create task"}
    }
}

// Get selected project task 
export async function getProjectTaskData(projectId: string,sharingPassword: string){
        const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }

        try {
            const tasksData = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    sharingPassword: sharingPassword
                },
                include:{tasks: true}
            })
            return {tasksData}
        } catch (error) {
            return {error: "Failed to fetch project data"}
        }
}

// Update task 
interface Data {
    title?:string | null ;
    description?:string | null;
    status?:TaskStatus | null;
}
export async function updateTask(task: Task,data:Data){
     const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        const updateData: any = {}
        if(data.title) updateData.title =data.title
        if(data.description) updateData.description = data.description
        if(data.status) updateData.status =data.status

        try {
            // checking project ownership 
            const project = await prisma.project.findUnique({
                where: {
                    id: task.projectId,
                    freelancerId: session.user.id,
                }
            })
            if(!project){return {error: "Failed to update task details"}}

            const updatedTask = await prisma.task.update({
                where: {id : task.id},
                data: updateData
            })
            return {message: "Task updated successfully",updatedTask}
        } catch (error) {
            return{error: "Failed to update task details"}
        }
}

// Delete Task 
export async function deleteTask(task: Task){
     const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        try {
            // checking project ownership 
            const project = await prisma.project.findUnique({
                where: {
                    id: task.projectId,
                    freelancerId: session.user.id,
                }
            })
            if(!project){return {error: "Failed to delete task details"}}

             await prisma.task.delete({
                where: {
                    id : task.id,
                    projectId :task.projectId
                }
            })
            return {message: "Task deleted successfully"}
        } catch (error) {
            return{error: "Failed to delete task details"}
        }
}
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
        const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        project: {
          connect: {
            id: project.id,
            freelancerId: session.user.id,
          }
        }
      }
    })
    return { message: "Task created successfully", task }

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
                include:{
                    tasks: {
                        include:{
                            _count: {
                                select : {messages: true}
                            }
                        }
                }}
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
            const updatedTask = await prisma.task.update({
                where: { id: task.id,
                         project:{
                            freelancerId: session.user.id,
                            }
                        },
                data: updateData
            })
            return {message: "Task updated successfully",updatedTask}
        } catch (error) {
            return{error: "Failed to update task details"}
        }
}

// trash task by changing status 
export async function trashTask(task: Task){
     const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }

        try {
            // combined ownership check + status change 
            const updatedTask = await prisma.task.update({
                where: { id: task.id,
                         project:{
                            freelancerId: session.user.id,
                            }
                        },
                data: {
                    status: 'scraped'
                }
            })
            return {message: "Task moved to Trash",updatedTask}
        } catch (error) {
            return{error: "Failed to move to Trash"}
        }
}

// Permanent Delete Task 
export async function deleteTask(task: Task){
     const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        try {
            // checking project ownership 
            await prisma.task.delete({
                where: { 
                    id: task.id,
                    project:{
                        freelancerId: session.user.id,
                    }
                }
            })
            return {message: "Task deleted successfully"}
        } catch (error) {
            return{error: "Failed to delete task details"}
        }
}
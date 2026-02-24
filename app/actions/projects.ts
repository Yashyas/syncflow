"use server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Create project by freelancer
export async function createProject(formData: FormData){
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id){
        redirect("/api/auth/login")   
    }
    const freelancerId = session.user.id
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const client = formData.get("client") as string

    if(!title || !description || !client) return {error:"Missing fields"}

    try {
        const exisistingProject = await prisma.project.findFirst({
            where: {
                title,
                client,
                freelancerId,
            }
        })
        if (exisistingProject) {
            return { error: "Project with this title already exists for this client" }
        }
        //Generate a random 8 character password
        const sharingPassword = Math.random().toString(36).slice(4,12).toLowerCase()

        const project = await prisma.project.create({
            data:{
                title,
                description,
                client,
                sharingPassword,
                freelancerId,
            }
        })
        if (project) {
            revalidatePath("/dashboard")
            return {message: "Project created successfully"}   
        }

    } catch (error) {
        return {error: "Failed to create project"}
    }
}

//Delete project by freelancer
export async function deleteProject(projectId: string){
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id){
        redirect("/api/auth/login")   
    }
    const freelancerId = session.user.id
    try {
        const deleted = await prisma.project.delete({
            where: {
                id: projectId,
                freelancerId,
            }
        })
            if (deleted) {
                revalidatePath("/dashboard")
                return {message: "Project deleted successfully"}   
            }
    } catch (error) {
        
    }
}

// Fetch all projects of a Freelancer
export async function getUserProjects(){
        const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        const freelancerId = session.user.id
        try {
            const projects = await prisma.project.findMany({
                where: {
                    freelancerId,
                }
            })
            return projects
        } catch (error) {
            return {error: "Failed to fetch projects"}
        }
}

// Fetch shared project for the client
export async function getClientProject() {
    
}

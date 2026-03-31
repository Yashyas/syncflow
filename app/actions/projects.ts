"use server"
import { authOptions } from "@/lib/auth"
import { Project } from "@prisma/client"
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
                tasks:{
                    create : {
                        title: `${client} & ${session.user.name} Chat`,
                        description: `Direct communication channel for ${title}.`,
                        status: "central_chat",
                    }
                }
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
                },
                orderBy:{
                    createdAt: "desc"
                }
            })
            return {projects}
        } catch (error) {
            return {error: "Failed to fetch projects"}
        }
}

// Get selected project data by freelancer 
export async function getUserProjectData(projectId: string){
        const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        const freelancerId = session.user.id
        try {
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    freelancerId,
                }
            })
            return {project}
        } catch (error) {
            return {error: "Failed to fetch project data"}
        }
}


// Update project 
interface Data {
    title?:string | null ;
    description?:string | null;
    client?:string | null;
    sharingPassword?:string ;
}

export async function updateProject(project: Project,data:Data){
     const session = await getServerSession(authOptions)
        if (!session || !session.user.id){
            redirect("/api/auth/login")   
        }
        const updateData: any = {}
        if(data.title) updateData.title =data.title
        if(data.description) updateData.description = data.description
        if(data.client) updateData.client =data.client
        if(data.sharingPassword) updateData.sharingPassword =data.sharingPassword


        try {
            // checking project ownership 
            const updatedProject = await prisma.project.update({
                where: { id: project.id, freelancerId: session.user.id,},
                data: updateData
            })
            return {message: "Project updated successfully",updatedProject}
        } catch (error) {
            return{error: "Failed to update project details"}
        }
}

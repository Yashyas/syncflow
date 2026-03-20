"use server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

// Fetch shared project for the client
export async function getClientProject(projectId: string ,sharingPassword: string) {
    try {
            if(!projectId || !sharingPassword){
                return {error: "ProjectId and Sharing Password required"}
            }
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    sharingPassword: sharingPassword
                },
                include:{
                    freelancer:{
                        select:{name:true}
                    }
                }
            })
            if(!project){
                return {error: "Invalid ProjectId or Password"}
            }
            console.log(project)
            return {project}
        } catch (error) {
            return {error: "Failed to fetch project data"}
        }
}


// get tasks including message count.
export async function getClientProjectTaskData(projectId: string,sharingPassword: string){

        if (!projectId || !sharingPassword){
            redirect("/client")   
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
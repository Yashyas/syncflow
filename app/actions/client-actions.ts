"use server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

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
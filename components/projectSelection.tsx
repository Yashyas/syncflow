'use client'
import ProjectCard from '@/components/projectCard'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddProject from './addProject'
import { getUserProjects } from '@/app/actions/projects'
import { Project } from '@/lib/generated/prisma/client'
import { toast } from 'sonner'
import { useDashboardStore } from '@/app/store/dashboardStore'
import { Spinner } from './ui/spinner'
import { setTimeout } from 'timers/promises'



export default function ProjectSelection() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)

    // No.1. from zustand store project selection drawer toggle 
    const toggleProjectSelectionDrawer = useDashboardStore((state) => state.toggleProjectSelectionDrawer)
    const isProjectSelectionDrawerOpen = useDashboardStore((state) => state.isProjectSelectionDrawerOpen)

    //No.2. from zustand store project selection 
    const selectedProject = useDashboardStore((state) => state.selectedProject)
    const setSelectedProject = useDashboardStore((state) => state.setSelectedProject)

    // No.3. from zustand store to toggle add project drawer 
    const toggleAddProjectDrawer = useDashboardStore((state) => state.toggleAddProjectDrawer)
    const isAddProjectDrawerOpen = useDashboardStore((state) => state.isAddProjectDrawerOpen)


    async function fetchProjects() {
        setLoading(true)

        const fetchProject = await getUserProjects()
        if (fetchProject.error) {
            toast.error(fetchProject.error)
        }
        setProjects(fetchProject.projects ?? [])
        setLoading(false)
    }

    useEffect(() => {
        if (isProjectSelectionDrawerOpen) {
            fetchProjects()
        }
    }, [isProjectSelectionDrawerOpen])

    const handleSelection = (project: Project) => {
        setSelectedProject(project)
        toast.success(`Selected project: ${project.title}`)
        toggleProjectSelectionDrawer()

    }

    const handleCreateProject = () => {
        toggleAddProjectDrawer()
    }

    return (
        <Dialog open={isProjectSelectionDrawerOpen} onOpenChange={toggleProjectSelectionDrawer}>
            <AddProject onSuccess={() => fetchProjects()} />
            <DialogContent className='flex flex-col max-h-[80vh] min-h-[80vh] min-w-[70vw]' showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Select Project</DialogTitle>
                    <DialogDescription>
                        Select a project that you want to work on.
                    </DialogDescription>
                </DialogHeader>
                {loading && (
                    <div className='flex justify-center h-[60vh] items-center p-4'>
                        <Spinner />
                    </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mt-4 overflow-y-auto'>
                    <Card className='shadow-none border-2 border-dashed hidden md:grid cursor-pointer hover:bg-primary hover:text-primary-foreground text-muted-foreground' onClick={handleCreateProject}>
                        <CardContent className='flex items-center justify-center h-full text-center  gap-2'>
                            <CirclePlus />
                            <p className='text-lg font-semibold'>Create a new project</p>
                        </CardContent>
                    </Card>

                    {projects.map((project) => (
                        <div className={`rounded-xl transition-all duration-400 ${selectedProject?.id === project.id ? 'ring-2 ring-ring ' : ''}`} key={project.id} onClick={() => handleSelection(project)}>
                            <ProjectCard {...project} />
                        </div>

                    ))}
                </div>
                <DialogFooter className='ml-auto'>
                    <div className='flex gap-1 w-fit bg-primary text-accent-foreground rounded-sm p-2 hover:bg-secondary' onClick={handleCreateProject}>
                        <CirclePlus />
                        <p className='text-sm '>Create</p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

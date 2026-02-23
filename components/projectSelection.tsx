'use client'
import ProjectCard from '@/components/projectCard'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog ,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/dialog'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'

const projects = [
    {id: 1, title: "Task Manager", client: "Yash Mishra", description: "Create a task manager app with React and Node.js"},
    {id: 2, title: "Watch Ecommerce ", client: "Tarun Bansal", description: "Build an ecommerce website for watches using Next.js and MongoDB"},
    {id: 3, title: "Freelancer Saas website", client: "Barnawal", description: "Develop a SaaS platform for freelancers to manage their projects and clients using React and Firebase"},
    {id: 4, title: "Blog Platform", client: "Ankit Kumar", description: "Create a blogging platform with user authentication and content management using Next.js and PostgreSQL"},
    {id: 5, title: "Fitness Tracker", client: "Rohit Sharma", description: "Build a fitness tracking app with React Native and Node.js backend"},
]

export default function ProjectSelection() {
    const [open, setOpen] = useState(true)
    const [selection, setSelection] = useState(0)

    useEffect(() => {
        // call server to populate projects of the freelancer
        setOpen(true)
    },[])

    const handleSelection = (projectId : number) => {
        setSelection(projectId)
        // calls database to populate dashboard with said project
        console.log(`Selected project with id: ${projectId}`)
        // setOpen(false)
    }

    const handleCreateProject = () => {
        // calls database to create a new project and then populates the dashboard with it
        console.log("Creating a new project")
    }
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
         
        <DialogContent className='flex flex-col max-h-[80vh]  min-w-[70vw]' showCloseButton={false}
          onPointerDownOutside={(e)=> e.preventDefault()}
          onEscapeKeyDown={(e)=> e.preventDefault()}
        >
            <DialogHeader>
                <DialogTitle>Select Project</DialogTitle>
                <DialogDescription>
                     Select a project that you want to work on.
                </DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mt-4 overflow-y-auto'>
                <Card className='shadow-none border-2 border-dashed hidden md:grid cursor-pointer hover:bg-primary hover:text-primary-foreground text-muted-foreground' onClick={handleCreateProject}>
                    <CardContent className='flex items-center justify-center h-full text-center  gap-2'>
                        <CirclePlus/>
                        <p className='text-lg font-semibold'>Create a new project</p>
                    </CardContent>
                </Card>
            {projects.map((project) => (
                <div className={`rounded-xl transition-all duration-400 ${selection === project.id ? 'ring-2 ring-ring ' : ''}`} key={project.id} onClick={() => handleSelection(project.id)}>
                    <ProjectCard {...project} />
                </div>
                
            ))}
            </div>
               <DialogFooter className='ml-auto'>
                  <div className='flex gap-1 w-fit bg-primary text-accent-foreground rounded-sm p-2 hover:bg-secondary' onClick={handleCreateProject}>
                    <CirclePlus/>
                     <p className='text-sm '>Create</p>
                  </div>
               </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

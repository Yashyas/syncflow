"use client"
import { AppSidebar } from '@/components/app-sidebar'
import ProjectSelection from '@/components/projectSelection'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useDashboardStore } from '../store/dashboardStore'
import DeleteProject from '@/components/deleteProject'
import { ShareProject } from '@/components/shareProject'
import KanbanBoard from '@/components/kanbanBoard/kanbanBoard'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Activity, CirclePlus, Edit, FolderInput, FolderX, Lightbulb, MessageSquare, Share, Trash } from 'lucide-react'

export default function DashboardClient() {
  const selectedProject = useDashboardStore((state) => state.selectedProject)
  const toggleProjectSelectionDrawer = useDashboardStore((state) => state.toggleProjectSelectionDrawer)

  return (
    <div>
      <ProjectSelection />
      <DeleteProject />
      <ShareProject />
      {/* Sidebar and breadcrums  */}
    
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex flex-col h-22 shrink-0 gap-2 ">
            <div className="flex items-center h-12 gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" onClick={toggleProjectSelectionDrawer}>
                      Project Selection
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedProject?.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className='flex items-center justify-center top-0 sticky h-10'>
              <ButtonGroup>

                <ButtonGroup>
                  <Button><CirclePlus />Task</Button>
                  <Separator orientation='vertical' />
                  <Button ><Trash /> Trash</Button>
                </ButtonGroup>

                <ButtonGroup>
                  <Button><MessageSquare /> Message</Button>
                  <Separator orientation='vertical' />
                  <Button><Activity />Activity</Button>
                  <Separator orientation='vertical' />
                  <Button><Lightbulb />Ideas</Button>
                </ButtonGroup>

                <ButtonGroup>
                  <Button><Share /> Share</Button>
                  <Separator orientation='vertical' />
                  <Button><Edit /></Button>
                  <Separator orientation='vertical' />
                  <Button><FolderInput />Change Project</Button>
                  <Separator orientation='vertical' />
                  <Button><FolderX />Delete Project</Button>
                </ButtonGroup>

              </ButtonGroup>
            </div>
          </header>
          <KanbanBoard />
          {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

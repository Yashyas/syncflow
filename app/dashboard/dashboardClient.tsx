"use client"
import { AppSidebar } from '@/components/app-sidebar'
import ProjectSelection from '@/components/projectSelection'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { CurrentView, useCentralChatTask, useDashboardStore } from '../store/dashboardStore'
import DeleteProject from '@/components/deleteProject'
import { ShareProject } from '@/components/shareProject'
import KanbanBoard from '@/components/kanbanBoard/kanbanBoard'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Activity, CirclePlus, Edit, FolderInput, FolderX, Lightbulb, ListTodo, MessageSquare, Share, Trash } from 'lucide-react'
import ChatWindow  from '@/components/chatWindow'
import Setting from '@/components/setting'

export default function DashboardClient() {
  const selectedProject = useDashboardStore((state) => state.selectedProject)
  const toggleProjectSelectionDrawer = useDashboardStore((state) => state.toggleProjectSelectionDrawer)
  const toggleAddTaskDrawer = useDashboardStore((state) => state.toggleAddTaskDrawer)
  const toggleDeleteProjectDrawer = useDashboardStore((state) => state.toggleDeleteProjectDrawer)
  const toggleShareProjectDrawer = useDashboardStore((state) => state.toggleShareProjectDrawer)
  const currentDashboardView = useDashboardStore((state) => state.currentDashboardView)
  const setCurrentDashboardView = useDashboardStore((state) => state.setCurrentDashboardView)
  const setSelectedTask = useDashboardStore((state) => state.setSelectedTask)
  const centralChat = useCentralChatTask()

  function messageOnClick(){   
      if(centralChat){
          setSelectedTask(centralChat)
      }
      setCurrentDashboardView(CurrentView.CHAT)
    }
  return (

    <div>
      <ProjectSelection />
      <DeleteProject />
      <ShareProject />
      <Setting />
      {/* Sidebar and breadcrums  */}
    
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex flex-col h-24 shrink-0 gap-2 p-2 shadow-xs backdrop-blur-md bg-card/40">
            <div className="flex items-center h-12 gap-2 px-3 border-b-1">
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

            {/* large and medium device  */}
            <div className='flex items-center justify-around top-0 sticky h-10 hidden md:flex '>
              <ButtonGroup>

                <ButtonGroup className={`${currentDashboardView === CurrentView.CHAT ? "hidden" : "flex"}`}>
                  <Button onClick={toggleAddTaskDrawer}><CirclePlus />Task</Button>
                  <Separator orientation='vertical' />
                  <Button ><Trash /> Trash</Button>
                </ButtonGroup>

                <ButtonGroup>
                  <Button onClick={messageOnClick} ><MessageSquare /> Message</Button>
                  <Separator orientation='vertical' />
                  <Button onClick={ () => setCurrentDashboardView(CurrentView.KANBAN)}><ListTodo/> Tasks</Button>
                  <Separator orientation='vertical' />
                  <Button><Lightbulb />Ideas</Button>
                </ButtonGroup>

                <ButtonGroup className={`${currentDashboardView === CurrentView.CHAT ? "hidden" : "flex"}`}>
                  <Button onClick={toggleShareProjectDrawer}><Share /> Share</Button>
                  <Separator orientation='vertical' />
                  <Button><Edit /></Button>
                  <Separator orientation='vertical' />
                  <Button onClick={toggleProjectSelectionDrawer}><FolderInput />Change Project</Button>
                  <Separator orientation='vertical' />
                  <Button onClick={toggleDeleteProjectDrawer}><FolderX />Delete Project</Button>
                </ButtonGroup>

              </ButtonGroup>
            </div>

            {/* mobile device  */}
             <div className='flex items-center justify-center top-0 sticky h-10 sm:hidden '>
              <ButtonGroup className='flex max-w-[80vw]'>

                <ButtonGroup className={`${currentDashboardView === CurrentView.CHAT ? "hidden" : "flex"}`}>
                  <Button onClick={toggleAddTaskDrawer}><CirclePlus />Task</Button>
                  <Separator orientation='vertical' />
                  <Button ><Trash /></Button>
                </ButtonGroup>

                <ButtonGroup>
                  <Button onClick={messageOnClick} ><MessageSquare /></Button>
                  <Separator orientation='vertical' />
                  <Button onClick={() => setCurrentDashboardView(CurrentView.KANBAN)} className={`${currentDashboardView === CurrentView.KANBAN ? "hidden" : "flex"}`}> <ListTodo/> </Button>
                  <Separator orientation='vertical'/>
                  <Button><Lightbulb/></Button>
                </ButtonGroup>

                <ButtonGroup className={`${currentDashboardView === CurrentView.CHAT ? "hidden" : "flex"}`}>
                  <Button onClick={toggleShareProjectDrawer}><Share /></Button>
                  <Separator orientation='vertical' />
                  <Button><Edit /></Button>
                  <Separator orientation='vertical' />
                  <Button onClick={toggleProjectSelectionDrawer}><FolderInput /></Button>
                </ButtonGroup>

              </ButtonGroup>
            </div>
          </header>
          {/* conditional rendering of dashboard views  */}
          {currentDashboardView === CurrentView.KANBAN && <KanbanBoard />}
          {currentDashboardView === CurrentView.CHAT && <ChatWindow/>}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

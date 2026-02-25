"use client"

import {
  FolderDot,
  FolderOpenDot,
  Share,
  Trash,
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { useDashboardStore } from "@/app/store/dashboardStore"

export function NavProjects() {
  const { isMobile } = useSidebar()
  const toggleProjectSelectionDrawer = useDashboardStore((state) => state.toggleProjectSelectionDrawer)
  const selectedProject = useDashboardStore((state) => state.selectedProject)
  const toggleDeleteProjectDrawer = useDashboardStore((state) => state.toggleDeleteProjectDrawer)
  const toggleShareProjectDrawer = useDashboardStore((state)=> state.toggleShareProjectDrawer)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Current Project</SidebarGroupLabel>
      <SidebarMenu>
        <Card className="w-full flex-row items-center bg-primary p-4 border-0 rounded-none">
          <div className="flex items-center">
            <FolderOpenDot className="ml-2 h-6"/>
          <p className="ml-2 ">{selectedProject?.title}</p>
          </div>
          <div className="flex items-center ml-auto">
            <Share className=" hover:cursor-pointer h-5 " onClick={toggleShareProjectDrawer}/>
          <Trash className="ml-2 mr-2 hover:cursor-pointer h-5" onClick={toggleDeleteProjectDrawer} />
          </div> 
        </Card>

        <SidebarMenuItem className="mt-4">
            <Button variant="outline" size="sm" className="w-full bg-secondary" onClick={toggleProjectSelectionDrawer}>          
                  <FolderDot/>
                  <span>Change project</span>
            </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

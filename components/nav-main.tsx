"use client"

import {  Lightbulb, ListTodo, MessageSquare, Settings,  type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
 
} from "@/components/ui/sidebar"
import { CurrentView, useCentralChatTask, useDashboardStore } from "@/app/store/dashboardStore"

export function NavMain() {

  const setCurrentDashboardView = useDashboardStore((state) => state.setCurrentDashboardView)
  const toggleSettingDrawer = useDashboardStore((state) => state.toggleSettingDrawer)
  const setSelectedTask = useDashboardStore((state) => state.setSelectedTask)
    const centralChat = useCentralChatTask()
  
    function messageOnClick(){   
        if(centralChat){
            setSelectedTask(centralChat)
        }
        setCurrentDashboardView(CurrentView.CHAT)
      }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
            <SidebarMenuItem onClick={messageOnClick}>
                <SidebarMenuButton tooltip="Messages">
                  <MessageSquare/>
                  <span>Messages</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem onClick={ () => setCurrentDashboardView(CurrentView.IDEAS)}>
                <SidebarMenuButton tooltip="Ideas">
                  <Lightbulb/>
                  <span>Ideas</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem onClick={ () => setCurrentDashboardView(CurrentView.KANBAN)}>
                <SidebarMenuButton tooltip="Tasks">
                  <ListTodo/>
                  <span>Tasks</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem onClick={toggleSettingDrawer}>
                <SidebarMenuButton tooltip="Settings">
                  <Settings/>
                  <span>Settings</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

          
      
      </SidebarMenu>
    </SidebarGroup>
  )
}

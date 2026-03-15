"use client"

import { Activity, Bot, ChevronRight, Lightbulb, MessageSquare, Settings, Settings2, type LucideIcon } from "lucide-react"

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { CurrentView, useDashboardStore } from "@/app/store/dashboardStore"

export function NavMain() {

  const setCurrentDashboardView = useDashboardStore((state) => state.setCurrentDashboardView)
  const toggleSettingDrawer = useDashboardStore((state) => state.toggleSettingDrawer)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
            <SidebarMenuItem onClick={ () => setCurrentDashboardView(CurrentView.CHAT)}>
                <SidebarMenuButton tooltip="Messages">
                  <MessageSquare/>
                  <span>Messages</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Activity">
                  <Activity/>
                  <span>Activity</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem onClick={ () => setCurrentDashboardView(CurrentView.KANBAN)}>
                <SidebarMenuButton tooltip="Ideas">
                  <Lightbulb/>
                  <span>Ideas</span>
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

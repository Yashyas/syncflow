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

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
            <SidebarMenuItem>
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

            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Ideas">
                  <Lightbulb/>
                  <span>Ideas</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings/>
                  <span>Settings</span>
                </SidebarMenuButton>  
            </SidebarMenuItem>

          
      
      </SidebarMenu>
    </SidebarGroup>
  )
}

"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // teams coming soon 
  teams: [
    {
      name: "Coming Soon",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Coming Soon2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Coming Soon3",
      logo: Command,
      plan: "Free",
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
    
    },
    {
      name: "Sales & Marketing",
      url: "#",
     
    },
    {
      name: "Travel",
      url: "#",
    
    },
    {
      name: "Team Sync",
      url: "#",
  
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

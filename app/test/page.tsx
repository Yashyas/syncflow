"use client"
import React from 'react'
import AddProject from "@/components/addProject"
import DeleteProject from '@/components/deleteProject'
import { useDashboardStore } from '../store/dashboardStore'
import KanbanBoard from '@/components/kanbanBoard/kanbanBoard'
import { ChatWindow } from '@/components/chatWindow'
export default function page() {
  
  return (
    <div>
      <ChatWindow/>
    </div>
  )
}

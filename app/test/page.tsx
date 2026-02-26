"use client"
import React from 'react'
import AddProject from "@/components/addProject"
import DeleteProject from '@/components/deleteProject'
import { useDashboardStore } from '../store/dashboardStore'
import KanbanBoard from '@/components/kanbanBoard/kanbanBoard'
export default function page() {
  return (
    <div>
      <h1>Test</h1>
<KanbanBoard/>
    </div>
  )
}

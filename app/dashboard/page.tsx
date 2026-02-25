import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboardClient'


export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/login")
  }
  return <DashboardClient/>
}

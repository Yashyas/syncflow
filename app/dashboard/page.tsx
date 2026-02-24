import ProjectSelection from '@/components/projectSelection'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'


export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/login")
  }
    
  return (
    <div>
      <ProjectSelection />
    </div>
  )
}

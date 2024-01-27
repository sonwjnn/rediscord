import { Sidebar, SidebarSkeleton } from '@/components/sidebar'
import VoiceStatusFooter from '@/components/voice-status-footer'
import { getServerById } from '@/data/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { serverId: string }
}) => {
  const server = await getServerById(params.serverId)

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar serverId={params.serverId} />
        </Suspense>
        <VoiceStatusFooter />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}

export default ServerIdLayout

import { VoiceStatus, VoiceStatusSkeleton } from '@/components/voice-status'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { DMSidebar, DMSidebarSkeleton } from './_components/dm-sidebar'

const DMLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <Suspense fallback={<DMSidebarSkeleton />}>
          <DMSidebar />
        </Suspense>
        <Suspense fallback={<VoiceStatusSkeleton />}>
          <VoiceStatus />
        </Suspense>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}

export default DMLayout

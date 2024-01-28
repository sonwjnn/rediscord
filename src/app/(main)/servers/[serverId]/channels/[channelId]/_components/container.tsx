'use client'

import { cn } from '@/lib/utils'
import { useMemberSidebar } from '@/store/use-member-sidebar'
import { MemberWithUser, ServerWithMembersWithUsers } from '@/types'
import { Suspense, useEffect } from 'react'
import { useIsClient, useMediaQuery } from 'usehooks-ts'

import { MemberSidebar, MemberSidebarSkeleton } from './member-sidebar'

interface ContainerProps {
  children: React.ReactNode
  members: MemberWithUser[]
  server: ServerWithMembersWithUsers
}

export const Container = ({ children, members, server }: ContainerProps) => {
  const { isCollapsed, onCollapse, onExpand } = useMemberSidebar(state => state)
  const matches = useMediaQuery(`(max-width: 1024px)`)
  const isClient = useIsClient()

  useEffect(() => {
    if (matches) {
      onCollapse()
    }
  }, [matches, onCollapse, onExpand])

  if (!isClient) {
    return
  }

  return (
    <div className="h-full bg-white dark:bg-[#313338]">
      <div
        className={cn(
          'mr-60 flex h-full flex-col',
          isCollapsed ? 'mr-0' : 'mr-60'
        )}
      >
        {children}
      </div>

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-20 hidden h-full w-60 flex-col md:flex',
          isCollapsed && 'w-0'
        )}
      >
        <Suspense fallback={<MemberSidebarSkeleton />}>
          <MemberSidebar members={members} server={server} />
        </Suspense>
      </aside>
    </div>
  )
}

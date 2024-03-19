'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getServerById } from '@/data/server'
import { MemberWithUser, ServerWithMembersWithUsers } from '@/types'
import { Server } from '@prisma/client'
import { useState } from 'react'

import { MemberProfile } from './member-profile'

interface MemberProfileWrapperProps {
  children: React.ReactNode
  member: MemberWithUser
  server: ServerWithMembersWithUsers
  serverId?: string
}

export const MemberProfileWrapper = ({
  children,
  server,
  member,
}: MemberProfileWrapperProps) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const onPopoverOpenChange = () => {
    setPopoverOpen(!isPopoverOpen)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={onPopoverOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        side="right"
        className="relative  !w-full border-none bg-zinc-200/90 dark:bg-[#1e1f22] md:min-w-[360px]"
      >
        <MemberProfile server={server} member={member} />
      </PopoverContent>
    </Popover>
  )
}

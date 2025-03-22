'use client'

import { Hint } from '@/components/hint'
import { MemberMobileToggle } from '@/components/member-mobile-toggle'
import { MobileToggle } from '@/components/mobile-toggle'
import { SocketIndicator } from '@/components/socket-indicator'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { useMemberSidebar } from '@/store/use-member-sidebar'
import { MemberWithUser, ServerWithMembersWithUsers } from '@/types'
import { Hash } from 'lucide-react'
import { HiUsers } from 'react-icons/hi2'

import { ChatVideoButton } from './chat-video-button'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
  server?: ServerWithMembersWithUsers
  members?: MemberWithUser[]
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  members,
  server,
}: ChatHeaderProps) => {
  const { isCollapsed, onCollapse, onExpand } = useMemberSidebar(state => state)

  const onClick = () => {
    if (isCollapsed) {
      onExpand()
    } else {
      onCollapse()
    }
  }
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold  dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="mr-2 size-6 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar
          imageUrl={imageUrl}
          name={name}
          className="mr-2 size-8 md:h-8 md:w-8"
        />
      )}
      <p className="text-base font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === 'channel' && (
          <div className="mr-2 cursor-pointer">
            <Hint
              label={`${isCollapsed ? 'Show member list' : 'Hide member list'}`}
              side="bottom"
            >
              <div>
                <HiUsers
                  className="hidden text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 md:block"
                  size={22}
                  onClick={onClick}
                />
              </div>
            </Hint>
            <MemberMobileToggle server={server} members={members} />
          </div>
        )}
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}

export const ChatHeaderSkeleton = ({
  type,
}: {
  type: 'channel' | 'conversation'
}) => (
  <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
    <Skeleton className="size-8 md:hidden" />
    {type === 'conversation' && (
      <Skeleton className="mr-2 size-8 rounded-full md:size-8" />
    )}

    <Skeleton className="h-6 w-[200px] rounded-full" />

    <div className="ml-auto flex items-center gap-x-2">
      {type === 'conversation' && <Skeleton className="size-8 rounded-md" />}
      <Skeleton className="h-5 w-40 rounded-full" />
    </div>
  </div>
)

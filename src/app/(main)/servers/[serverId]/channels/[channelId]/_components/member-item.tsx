'use client'

import { MemberProfile } from '@/components/member/member-profile'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { MemberWithUser } from '@/types'
import { MemberRole, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

interface MemberItemProps {
  member: MemberWithUser
  server: Server
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
}

export const MemberItem = ({ member, server }: MemberItemProps) => {
  const user = useCurrentUser()
  const params = useParams()

  const [isOpen, setOpen] = useState(false)

  const onOpenChange = () => {
    setOpen(!isOpen)
  }

  const icon = roleIconMap[member.role]

  //TODO: Data not re-render when user change
  const data = member.user
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <div className=" flex min-w-[120px] justify-between gap-1">
        <PopoverTrigger asChild>
          <div
            // onClick={onClick}
            className={cn(
              'group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
              params?.memberId === member.id &&
                'bg-zinc-700/20 dark:bg-zinc-700'
            )}
          >
            <UserAvatar
              imageUrl={data?.image || ''}
              name={data?.name || ''}
              status={data?.status}
            />
            <div
              className={cn(
                'text-base font-medium text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
                params?.memberId === member.id &&
                  'text-primary dark:text-zinc-200 dark:group-hover:text-white'
              )}
            >
              <div className="flex max-w-[120px] flex-col justify-center">
                <div className="truncate">{data?.name}</div>
                <div className="truncate text-[10px] leading-tight">
                  {data?.bio}
                </div>
              </div>
            </div>
            {icon}
          </div>
        </PopoverTrigger>
      </div>
      <PopoverContent
        side="left"
        className="relative  !w-full border-none bg-zinc-200/90 dark:bg-[#1e1f22] md:min-w-[360px]"
      >
        <MemberProfile server={server} member={member} />
      </PopoverContent>
    </Popover>
  )
}

export const MemberItemSkeleton = () => (
  <div
    className={
      'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'
    }
  >
    <Skeleton className="size-8 rounded-full" />
    <Skeleton className="h-4 w-40" />
  </div>
)

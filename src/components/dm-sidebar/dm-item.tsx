'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { MemberWithUser } from '@/types'
import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface MemberProps {
  member: MemberWithUser
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
}

export const DMItem = ({ member }: MemberProps) => {
  const params = useParams()
  const router = useRouter()

  // const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/me/${member.serverId}/${member.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar imageUrl={member.user.image!} name={member.user.name!} />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.user.name}
      </p>
      {/* {icon} */}
    </button>
  )
}

export const DMItemSkeleton = () => (
  <div
    className={
      'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'
    }
  >
    <Skeleton className="size-8 rounded-full" />
    <Skeleton className="h-4 w-40" />
  </div>
)

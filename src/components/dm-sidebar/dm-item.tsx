'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'

interface MemberProps {
  user: User
}

export const DMItem = ({ user }: MemberProps) => {
  const router = useRouter()
  const params = useParams()
  const userId = params?.userId || ''

  // const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/me/${user.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        userId === user.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar imageUrl={user.image!} name={user.name!} />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          userId === user.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {user.name}
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

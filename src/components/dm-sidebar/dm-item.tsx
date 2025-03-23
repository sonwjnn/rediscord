'use client'

import { hiddenConversation } from '@/actions/conversation'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { X } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Hint } from '../hint'

interface MemberProps {
  user: User
}

export const DMItem = ({ user }: MemberProps) => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const userId = params?.userId || ''
  const [isPending, startTransition] = useTransition()

  // const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/me/${user.id}`)
  }

  const onHidden = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      if(!currentUser || !currentUser.id) return

      const userOneId = currentUser.id 
      const userTwoId = user.id

      await hiddenConversation(userOneId, userTwoId)

      if(pathname?.includes(`/${userTwoId}`)) {
        router.replace('/me')
      }
    })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 pr-2.5 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        userId === user.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      disabled={isPending}
    >
      <UserAvatar imageUrl={user.image!} name={user.name!} status={user.status} />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          userId === user.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {user.name}
      </p>
      <Hint label="Hidden this dm">
        <X className='size-4 ml-auto text-zinc-400 hover:text-white transition' onClick={onHidden}/>
      </Hint>
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

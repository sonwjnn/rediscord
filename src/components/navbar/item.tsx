'use client'

import { Hint } from '@/components/hint'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { ServerAvatar } from '../server-avatar'

interface ItemProps {
  id: string
  imageUrl: string
  name: string
  initialChannelId: string
}

export const Item = ({ id, initialChannelId, imageUrl, name }: ItemProps) => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}/channels/${initialChannelId}`)
  }

  return (
    <Hint side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all ease-linear',
            params?.serverId !== id && 'group-hover:h-[20px]',
            !pathname?.includes('/me') && params?.serverId === id
              ? 'h-[36px]'
              : 'h-[8px]'
          )}
        />

        <ServerAvatar
          name={name}
          imageUrl={imageUrl}
          size="md"
          isActive={params?.serverId === id}
        />
      </button>
    </Hint>
  )
}

export const ItemSkeleton = () => {
  return (
    <li>
      <Skeleton className="mx-auto flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all ease-linear" />
    </li>
  )
}

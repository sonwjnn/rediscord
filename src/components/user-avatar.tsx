import { LiveBadge } from '@/components/live-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const avatarSizes = cva('', {
  variants: {
    size: {
      default: 'h-8 w-8',
      md: 'h-11 w-11',
      lg: 'h-14 w-14',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  name: string
  imageUrl: string
  isLive?: boolean
  showBadge?: boolean
}

export const UserAvatar = ({
  name,
  imageUrl,
  isLive,
  showBadge,
  size,
}: UserAvatarProps) => {
  const canShowBadge = showBadge && isLive

  return (
    <div className="relative">
      <Avatar
        className={cn(
          isLive && 'border border-background ring-2 ring-rose-500',
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          {name[0]}
          {name[name.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform">
          <LiveBadge />
        </div>
      )}
    </div>
  )
}

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn('rounded-full', avatarSizes({ size }))} />
}

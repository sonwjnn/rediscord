'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import Image from 'next/image'
import { useState } from 'react'

const avatarSizes = cva('', {
  variants: {
    size: {
      xs: 'size-6',
      default: 'size-8',
      md: 'size-12',
      lg: 'size-14',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface ServerAvatarProps extends VariantProps<typeof avatarSizes> {
  name: string
  imageUrl?: string
  className?: string
  isActive?: boolean
}

export const ServerAvatar = ({
  name,
  imageUrl,
  size,
  className,
  isActive,
}: ServerAvatarProps) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={cn(
        'group relative mx-3 flex overflow-hidden rounded-[24px] transition-all ease-linear active:translate-y-[1px] group-hover:rounded-[16px]',
        isActive && 'rounded-[16px] bg-primary/10 text-primary',
        avatarSizes({ size }),
        className
      )}
    >
      {!imageError && imageUrl ? (
        <Image
          fill
          src={imageUrl}
          onError={() => setImageError(true)}
          alt="Channel"
          sizes="100%"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#424454] text-xl font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

interface ServerAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const ServerAvatarSkeleton = ({ size }: ServerAvatarSkeletonProps) => {
  return <Skeleton className={cn('rounded-full', avatarSizes({ size }))} />
}

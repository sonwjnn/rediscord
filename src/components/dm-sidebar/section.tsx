'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IconType } from "react-icons";

interface SectionProps {
  label: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export const Section = ({
  label,
  href,
  icon,
  disabled
}: SectionProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const onClick = () => {
    if(disabled) return

    router.push(href)
  }

  const isActive = !disabled && href === pathname
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-3 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        isActive && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      {icon}
      <p
        className={cn(
          'line-clamp-1 text-base ml-2 font-medium text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          isActive &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {label}
      </p>
    </button>
  )
}

export const SectionSkeleton = () => (
  <div className="flex items-center  py-2">
    <Skeleton className="w-8" />
  </div>
)

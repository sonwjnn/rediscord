'use client'

import { Hint } from '@/components/hint'
import { Skeleton } from '@/components/ui/skeleton'

interface SectionProps {
  label: string
}

export const Section = ({
  label,
}: SectionProps) => {

  return (
    <div className="flex items-center justify-between py-2 ml-3 h-12">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
        <Hint label="Create Channel" side="top">
          <button
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
          </button>
        </Hint>
    </div>
  )
}

export const SectionSkeleton = () => (
  <div className="flex items-center  py-2">
    <Skeleton className="w-8" />
  </div>
)

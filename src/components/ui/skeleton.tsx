import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-sm bg-zinc-200/90 dark:bg-zinc-700',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

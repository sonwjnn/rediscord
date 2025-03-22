'use client'

import { Hint } from '@/components/hint'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { BsDiscord } from 'react-icons/bs'

export const DirectMessages = () => {
  const router = useRouter()
  const pathname = usePathname()

  const onClick = () => {
    router.push(`/me`)
  }

  const isMeRoute = pathname?.includes('/me')

  return (
    <div>
      <Hint side="right" align="center" label="Direct Messages">
        <button onClick={onClick} className="group relative flex items-center">
          <div
            className={cn(
              'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all ease-linear',
              !isMeRoute && 'group-hover:h-[20px]',
              isMeRoute ? 'h-[36px]' : 'h-[8px]'
            )}
          />

          <div
            className={cn(
              'mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all ease-linear active:translate-y-[1px]  group-hover:rounded-[16px] group-hover:bg-[#525EDE] dark:bg-neutral-700',
              isMeRoute && 'rounded-[16px] bg-[#525EDE] dark:bg-[#525EDE]'
            )}
          >
            <BsDiscord
              className={cn(
                'text-black transition group-hover:text-white dark:text-zinc-200 dark:group-hover:text-white',
                isMeRoute && 'text-white dark:text-white'
              )}
              size={28}
            />
          </div>
        </button>
      </Hint>
    </div>
  )
}

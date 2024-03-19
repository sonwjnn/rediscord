'use client'

import { Hint } from '@/components/hint'
import { useRouter } from 'next/navigation'
import { BsDiscord } from 'react-icons/bs'

export const DirectMessages = () => {
  const router = useRouter()

  const onClick = () => {
    router.push(`/me`)
  }

  return (
    <div>
      <Hint side="right" align="center" label="Direct Messages">
        <button onClick={onClick} className="group flex items-center">
          <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all ease-linear active:translate-y-[1px]  group-hover:rounded-[16px] group-hover:bg-[#525EDE] dark:bg-neutral-700">
            <BsDiscord
              className="text-black transition group-hover:text-white dark:text-zinc-200 dark:group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </Hint>
    </div>
  )
}

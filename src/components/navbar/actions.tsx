'use client'

import { Hint } from '@/components/hint'
import { useModal } from '@/store/use-modal-store'
import { Plus } from 'lucide-react'

export const Actions = () => {
  const { onOpen } = useModal()

  return (
    <div>
      <Hint side="right" align="center" label="Add a server">
        <button
          onClick={() => onOpen('createServer')}
          className="group flex items-center"
        >
          <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden  rounded-[24px] bg-background transition-all ease-linear active:translate-y-[1px] group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </Hint>
    </div>
  )
}

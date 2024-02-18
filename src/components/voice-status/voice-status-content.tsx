'use client'

import StatusBadge from '@/components/ui/badge/status-badge'
// import { ListItem } from '@/components/ui/list'
import { PopoverContent } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { StaticUserStatuses, UserStatuses } from '@/types'
import { User } from '@prisma/client'
import { format } from 'date-fns'
import Image from 'next/image'
import React, { useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'

import { Hint } from '../hint'
import { PopupItem } from './item'
import { SwitchAccount } from './switch-account'
import { UserStatus } from './user-status'
import DialogContentMain from './voice-status-dialog-content-main'

export const VoiceStatusContent = () => {
  const currentUser = useCurrentUser()
  const [open, setOpen] = useState(false)
  const statuses = Object.values(StaticUserStatuses)
    .slice(0, 4)
    .map(status => ({
      value: status,
    }))

  const handleSubmit = (status: UserStatuses) => {
    const updatedUser = { ...currentUser, status: status }
  }

  const toolTipContent = (
    <UserStatus
      setOpen={setOpen}
      handleSubmit={handleSubmit}
      statuses={statuses}
    />
  )
  return (
    <>
      <div className=" h-[60px] w-full rounded-t-md bg-gray-300"></div>
      <UserAvatar
        className="relative -top-4 left-8 scale-[2]  ring-[3px] ring-zinc-200/90 dark:ring-[#1e1f22]"
        imageUrl={currentUser?.image || ''}
        name={currentUser?.name || ''}
      />
      <div className="relative mt-6 rounded-lg bg-white p-2 dark:bg-black">
        <Image
          src="/hashtag.png"
          height={28}
          width={28}
          alt="hashtag image"
          className="absolute -top-12 right-0 h-6 w-6  rounded bg-white object-cover p-0.5 text-white  dark:bg-black dark:text-black"
        />
        <p className="text-lg font-semibold">{currentUser?.name}</p>
        <p className="text-xs">{currentUser?.email}</p>
        <Separator className="mt-2" />
        <p className="mt-2 text-xs font-semibold">DISCORD MEMBER SINCE</p>
        <p className=" py-2 text-xs">
          {format(new Date(currentUser?.createdAt || ''), 'd MMM yyyy')}
        </p>
        <Hint
          label=""
          content={toolTipContent}
          side="right"
          className="relative left-6 bg-white text-sm dark:bg-black"
          sideOffset={0}
        >
          <PopupItem className="group mt-2 flex items-center justify-between space-x-2 rounded py-1  active:bg-[#4752c4]">
            <div className=" flex items-center justify-center">
              <StatusBadge
                className="relative !border-black group-hover:!border-foreground group-active:!border-primary"
                customBackgroundColor="!bg-black group-hover:!bg-foreground group-active:!bg-primary"
                // status={currentUser.status}
                status={'online'}
              />
              {/* <p className="ml-2">{currentUser.status}</p> */}
              <p className="ml-2">{'online'}</p>
            </div>
            <AiOutlineRight size="10" className="justify-self-end" />
          </PopupItem>
        </Hint>
        {/* <DialogContentMain
          currentUser={currentUser}
          handleSubmit={handleSubmit}
          statuses={statuses}
        /> */}
        <Separator className="h-[1px] w-full" />
        <SwitchAccount />
      </div>
    </>
  )
}

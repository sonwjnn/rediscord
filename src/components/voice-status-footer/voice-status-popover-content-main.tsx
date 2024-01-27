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
import Image from 'next/image'
import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'

import DialogContentMain from './voice-status-dialog-content-main'
import PopoverContentSub from './voice-status-popover-content-sub'
import UserStatus from './voice-status-user-status'

interface PopoverContentMainProps {
  setCurrentUser: (user: User | null) => void
}

function PopoverContentMain({ setCurrentUser }: PopoverContentMainProps) {
  const currentUser = useCurrentUser()
  const [hoverPopover, setHoverPopover] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const statuses = Object.values(StaticUserStatuses)
    .slice(0, 4)
    .map(status => ({
      value: status,
    }))

  const handleSubmit = (status: UserStatuses) => {
    const updatedUser = { ...currentUser, status: status }
  }
  return (
    <PopoverContent
      side="top"
      className="from-semibackground relative left-20 !w-full border-none bg-gradient-to-b to-background md:min-w-[360px]"
    >
      <div className=" h-[60px] w-full rounded-t-md bg-gray-300"></div>
      <UserAvatar
        className="relative -top-4 left-8 scale-[2]  ring-[3px] ring-[#1e1f22]"
        imageUrl={currentUser?.image || ''}
        name={currentUser?.name || ''}
      />
      <div className="relative mt-6 rounded-lg bg-black p-2">
        <Image
          src="/hashtag.png"
          height={28}
          width={28}
          alt="hashtag image"
          className="absolute -top-12 right-0 h-6 w-6  rounded bg-black  object-cover p-0.5"
        />
        <p className="text-lg font-semibold">{currentUser?.name}</p>
        <p className="text-xs">{currentUser?.name}</p>
        <Separator className="mt-2 h-[1px]" />
        <p className="mt-2 text-xs font-semibold">DISCORD MEMBER SINCE</p>
        <p className=" py-2 text-xs">3 dec 2019</p>
        <Separator className="h-[1px]" />
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            {/* <ListItem className="group mt-2 flex items-center justify-between space-x-2 !rounded !py-1 text-gray-200 active:!bg-primary">
              <div className=" flex items-center justify-center">
                <StatusBadge
                  className="relative !border-black group-hover:!border-foreground group-active:!border-primary"
                  customBackgroundColor="!bg-black group-hover:!bg-foreground group-active:!bg-primary"
                  status={currentUser.status}
                />
                <p className="ml-2">{currentUser.status}</p>
              </div>
              <AiOutlineRight size="10" className="justify-self-end" />
            </ListItem> */}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="!relative left-6 !text-sm"
            sideOffset={0}
          >
            {/* <UserStatus
              setOpen={setOpen}
              handleSubmit={handleSubmit}
              statuses={statuses}
            /> */}
          </TooltipContent>
        </Tooltip>
        {/* <DialogContentMain
          currentUser={currentUser}
          handleSubmit={handleSubmit}
          statuses={statuses}
        /> */}
        <Separator className="h-[1px] w-full" />
        <PopoverContentSub
          hoverPopover={hoverPopover}
          setHoverPopover={setHoverPopover}
        />
      </div>
    </PopoverContent>
  )
}

export default PopoverContentMain

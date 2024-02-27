'use client'

import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useModal } from '@/store/use-modal-store'
import React, { useState } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { HiSwitchVertical } from 'react-icons/hi'

import { PopupItem } from './item'

export const SwitchAccount = ({}) => {
	const currentUser = useCurrentUser()
	const { onOpen } = useModal()

	const [hoverPopover, setHoverPopover] = useState(false)
	return (
		<div
			onMouseOver={() => {
				setHoverPopover(true)
			}}
			onMouseLeave={() => {
				setHoverPopover(false)
			}}
		>
			<Popover open={hoverPopover} onOpenChange={setHoverPopover}>
				<PopoverTrigger asChild>
					<PopupItem className='mt-2 flex items-center  justify-between space-x-2 rounded py-1  active:bg-[#4752c4]'>
						<div className='flex items-center justify-center'>
							<HiSwitchVertical />
							<p className='ml-2'>Switch account</p>
						</div>
						<AiOutlineRight size='10' />
					</PopupItem>
				</PopoverTrigger>
				<PopoverContent
					side='right'
					className='relative left-6 min-w-[160px] max-w-[240px] border-none bg-white p-1.5 text-sm  dark:bg-black translate-x-2'
					sideOffset={0}
				>
					<PopupItem className='group flex items-center justify-between rounded px-3 py-1 leading-[16px] hover:bg-[#4752c4] hover:text-white'>
						<div className='flex items-center'>
							<UserAvatar
								imageUrl={currentUser?.image || ''}
								name={currentUser?.name || ''}
							/>
							<p className='ml-2 text-sm font-thin'>
								{currentUser?.name}
							</p>
						</div>
						<BsFillCheckCircleFill
							size='16'
							className='text-primary group-hover:text-white'
						/>
					</PopupItem>
					<Separator className='my-2 h-[1px] w-full' />

					<PopupItem
						onClick={() => onOpen('switchAccount')}
						className=' items-center justify-between  rounded py-3 text-sm leading-[16px] hover:bg-[#4752c4] hover:text-white'
					>
						Manage Accounts
					</PopupItem>
				</PopoverContent>
			</Popover>
		</div>
	)
}

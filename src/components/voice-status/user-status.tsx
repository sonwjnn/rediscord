'use client'

import StatusBadge from '@/components/ui/badge/status-badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Statuses } from '@prisma/client'

import { PopupItem } from './item'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useState, useTransition } from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { useCurrentUser } from '@/hooks/use-current-user'
import { updateUserStatus } from '@/actions/user'
import { toast } from 'sonner'

const formattedStatuses = Object.values(Statuses).slice(0, 4)

export const UserStatus = () => {
	const user = useCurrentUser()
	const [hoverPopover, setHoverPopover] = useState(false)

	const [isPending, startTransition] = useTransition()

	const onChangeStatus = async (value: Statuses) => {
		if (!user) return
		setHoverPopover(false)
		startTransition(() => {
			updateUserStatus(value, user?.id!)
				.then(() => {
				})
				.catch(() => toast.error('Something went wrong!'))
		})
	}

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
				<PopoverTrigger disabled={isPending} asChild>
					<PopupItem className='group mt-2 flex items-center justify-between space-x-2 rounded py-1 active:bg-[#4752c4]'>
						<div className=' flex items-center justify-center bg-transparent'>
							<StatusBadge
								className='size-[9px] border-none relative'
								status={user?.status}
								idleClassName='bg-white group-hover:bg-[#EBEBEC] group-hover:dark:bg-[#26262B] dark:bg-black '
							/>
							<p className='ml-2 capitalize'>
								{user?.status.toLowerCase()}
							</p>
						</div>
						<AiOutlineRight
							size='10'
							className='ml-auto'
						/>
					</PopupItem>
				</PopoverTrigger>
				<PopoverContent
					side='right'
					className='relative left-6 min-w-[300px] border-none bg-white p-1.5 text-sm dark:bg-black translate-x-2'
					sideOffset={0}
				>
					{formattedStatuses.map((status, index) => (
						<>
							<PopupItem
								onClick={() => onChangeStatus(status)}
								className='group my-1 min-w-[180px] max-w-[380px] flex-col  items-start rounded hover:bg-[#4752c4] hover:text-white dark:hover:bg-[#4752c4]'
								key={index}
							>
								<div className='flex items-center'>
									<StatusBadge
										className='relative h-[9px]  w-[9px] border-none group-hover:bg-white '
										status={status}
										idleClassName='bg-white group-hover:bg-[#4752c4] dark:bg-black '
									/>
									<p className='ml-2 capitalize'>
										{status.toLowerCase()}
									</p>
								</div>
								<div className='ml-5 text-[12px]'>
									{status === Statuses.OFFLINE && (
										<p>
											You won&apos;t appear as available,
											but you&apos;ll have access to all
											Discord features.
										</p>
									)}
									{status === Statuses.DND && (
										<p>
											You will not receive desktop
											notifications.
										</p>
									)}
								</div>
							</PopupItem>
							<Separator
								className={cn(
									`my-2 h-[1px] w-full`,
									status === Statuses.ONLINE
										? 'block'
										: 'hidden',
								)}
							/>
						</>
					))}
				</PopoverContent>
			</Popover>
		</div>
	)
}

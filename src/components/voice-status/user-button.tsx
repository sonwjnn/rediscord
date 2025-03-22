'use client'

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { VoiceStatusContent } from '@/components/voice-status/voice-status-content'
import { useCurrentUser } from '@/hooks/use-current-user'
import { t } from '@/lib/i18n'
import { useState } from 'react'

export const UserButton = () => {
	const user = useCurrentUser()
	const [isOpen, setOpen] = useState(false)

	const onOpenChange = () => {
		setOpen(!isOpen)
	}

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<div className=' flex min-w-[120px] justify-between gap-1'>
				<PopoverTrigger asChild>
					<button className='group flex gap-2 rounded-md py-1 pl-0.5 pr-2 text-left leading-tight transition hover:bg-zinc-300 dark:hover:bg-white/10 '>
						<UserAvatar
							imageUrl={user?.image || ''}
							name={user?.name || ''}
							status={user?.status}
						/>

						<div>
							<div className='line-clamp-1 text-sm font-medium'>
								{user?.name}
							</div>
							<div className='line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400'>
								{t(user?.status)}
							</div>
						</div>
					</button>
				</PopoverTrigger>
			</div>
			<PopoverContent
				side='top'
				className='relative left-20 !w-full border-none bg-zinc-200/90 dark:bg-[#1e1f22] md:min-w-[360px]'
			>
				<VoiceStatusContent setOpen={setOpen} />
			</PopoverContent>
		</Popover>
	)
}

export const UserButtonSkeleton = () => (
	<div className={'flex min-w-[120px] items-start gap-x-1 py-1'}>
		<Skeleton className='size-8 rounded-full' />
		<div className='mt-1 flex flex-col gap-y-1'>
			<Skeleton className='h-2 w-20' />
			<Skeleton className='h-2 w-12' />
		</div>
	</div>
)

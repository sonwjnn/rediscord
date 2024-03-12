'use client'

import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { format } from 'date-fns'
import Image from 'next/image'

import { PopupItem } from './item'
import { SwitchAccount } from './switch-account'
import { UserStatus } from './user-status'
import { useModal } from '@/store/use-modal-store'
import { CopyIcon, SmileIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { EditProfileButton } from './edit-profile-button'
import { usePalette } from 'color-thief-react'
import { stringToColor } from '@/lib/utils'

interface VoiceStatusContentProps {
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const VoiceStatusContent = ({ setOpen }: VoiceStatusContentProps) => {
	const user = useCurrentUser()
	const [bgColor, setBgColor] = useState<string>('')
	const { data: color } = usePalette(user?.image as string, 10, 'hex', {
		crossOrigin: 'Anonymous',
		quality: 100,
	})

	const { onOpen } = useModal()

	useEffect(() => {
		if (color) {
			setBgColor(color?.[2] ?? '#e0e0e0')
		}
	}, [color, user])

	const onCopy = () => {
		navigator.clipboard.writeText(`${user?.id}`)
		setOpen(false)
	}

	return (
		<>
			<div
				className='relative h-[60px] w-full rounded-t-md bg-gray-300'
				style={{ backgroundColor: bgColor }}
			>
				<EditProfileButton className='absolute right-1 top-1' />
			</div>
			<UserAvatar
				className='-top-4 left-8 scale-[2] ring-[3px] ring-zinc-200/90 dark:ring-[#1e1f22]'
				imageUrl={user?.image || ''}
				name={user?.name || ''}
				status={user?.status}
			/>
			<div className='relative mt-6 rounded-lg bg-white py-2 px-3 dark:bg-black'>
				<Image
					src='/hashtag.png'
					height={28}
					width={28}
					alt='hashtag image'
					className='absolute -top-12 right-0 h-6 w-6  rounded bg-white object-cover p-0.5 text-white  dark:bg-black dark:text-black'
				/>
				<p className='text-lg font-semibold'>{user?.name}</p>
				<p className='text-xs'>{user?.bio}</p>
				<Separator className='my-2' />
				<p className='mt-2 text-xs font-semibold'>
					DISCORD MEMBER SINCE
				</p>
				<p className=' py-2 text-xs'>
					{format(new Date(user?.createdAt), 'd MMM yyyy')}
				</p>

				<UserStatus />
				<PopupItem
					onClick={() => onOpen('editUserStatus')}
					className='group mt-2 flex items-center justify-between space-x-2 rounded py-1  active:bg-[#4752c4]'
				>
					<div className=' flex items-center justify-center'>
						<SmileIcon size={18} />
						<p className='ml-2'>
							Set your own status
						</p>
					</div>
				</PopupItem>

				<Separator className='my-2' />
				<SwitchAccount />
				<Separator className='my-2' />
				<PopupItem
					onClick={onCopy}
					className='group mt-2 flex items-center justify-between space-x-2 rounded py-1  active:bg-[#4752c4]'
				>
					<div className=' flex items-center justify-center'>
						<CopyIcon size={18} />
						<p className='ml-2'>
							Copy User Id
						</p>
					</div>
				</PopupItem>
			</div>
		</>
	)
}

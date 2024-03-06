'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserAvatar } from '@/components/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { stringToColor } from '@/lib/utils'
import { MemberWithUser } from '@/types'
import { Server } from '@prisma/client'
import { format } from 'date-fns'
import { Forward, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BsDiscord } from 'react-icons/bs'
import { RoleBadge } from './role-badge'

interface MemberButtonProps {
	member: MemberWithUser
	server: Server
}
export const MemberButton = ({ server, member }: MemberButtonProps) => {
	const user = useCurrentUser()
	const router = useRouter()

	const color = stringToColor(member.user.name || '')

	const onClick = () => {
		if (user?.id === member.userId) return

		router.push(`/servers/${server.id}/conversations/${member.id}`)
	}

	return (
		<div>
			<div
				className=' h-[60px] w-full rounded-t-md bg-gray-300'
				style={{ backgroundColor: color }}
			>
			</div>
			<UserAvatar
				className='-top-4 left-8 scale-[2] ring-[3px] ring-zinc-200/90 dark:ring-[#1e1f22]'
				imageUrl={member.user.image || ''}
				name={member.user.name || ''}
				status={member.user.status}
			/>
			<div className='relative mt-6 rounded-lg bg-white py-2 px-3 dark:bg-black'>
				<Image
					src='/hashtag.png'
					height={28}
					width={28}
					alt='hashtag image'
					className='absolute -top-12 right-0 h-6 w-6  rounded bg-white object-cover p-0.5 text-white  dark:bg-black dark:text-black'
				/>
				<p className='text-lg font-semibold'>{member.user.name}</p>
				<p className='text-xs'>{member.user.bio}</p>
				<Separator className='mt-2' />
				<div className='my-2'>
					<p className='text-xs font-bold'>
						MEMBER SINCE
					</p>
					<div className='flex gap-x-3'>
						<div className='flex py-2 text-xs items-center gap-x-1'>
							<BsDiscord className='text-[#ABAFB7]' size={14} />
							{format(
								new Date(member.user.createdAt),
								'd MMM yyyy',
							)}
						</div>

						<div className='flex items-center'>
							<div className='size-1 rounded-full bg-[#4C4D55]' />
						</div>
						<div className='flex items-center gap-x-1 py-2 text-xs'>
							<div className='relative rounded-full'>
								<Avatar className='size-4'>
									<AvatarImage
										src={server?.image}
										className='object-cover'
									/>
									<AvatarFallback>
										{server?.name}
									</AvatarFallback>
								</Avatar>
							</div>
							{format(new Date(member.createdAt), 'd MMM yyyy')}
						</div>
					</div>
				</div>

				<div className='my-2'>
					<p className='text-xs font-bold'>
						ROLES
					</p>
					<div className='flex gap-x-3'>
						<div className='flex py-2 text-xs items-center gap-x-1'>
							<RoleBadge role={member.role} />
						</div>
					</div>
				</div>
				<Button
					className='w-full  bg-zinc-700/10  text-zinc-600 hover:bg-zinc-700/20 hover:text-zinc-600 focus-visible:bg-gray-800/50 focus-visible:text-gray-100  focus-visible:ring-0 dark:text-zinc-400 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-300'
					onClick={onClick}
				>
					<div className='flex items-center'>
						<MessageCircleMore size={18} className='mr-2' />Send a
						message
					</div>
					<Forward size={18} className='ml-auto' />
				</Button>
			</div>
		</div>
	)
}

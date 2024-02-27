'use client'

import { createChannel } from '@/actions/channel'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ChannelSchema } from '@/schemas'
import { useModal } from '@/store/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import { LogOutIcon, MoreVertical } from 'lucide-react'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { UserAvatar } from '../user-avatar'

export const SwitchAccountModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const user = useCurrentUser()
	const [isPending, startTransition] = useTransition()

	const isModalOpen = isOpen && type === 'switchAccount'
	const { channelType, server } = data

	const form = useForm({
		resolver: zodResolver(ChannelSchema),
		defaultValues: {
			name: '',
			type: channelType || ChannelType.TEXT,
		},
	})

	useEffect(() => {
		if (channelType) {
			form.setValue('type', channelType)
		} else {
			form.setValue('type', ChannelType.TEXT)
		}
	}, [channelType, form])

	const onSubmit = async (values: z.infer<typeof ChannelSchema>) => {
		if (!server) return
		startTransition(() => {
			createChannel(values, server?.id)
				.then(() => {
					toast.success('Channel created')
					form.reset()
					onClose()
				})
				.catch(() => toast.error('Something went wrong'))
		})
	}

	const handleClose = () => {
		form.reset()
		onClose()
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='overflow-hidden bg-white p-0 text-black'>
				<DialogHeader className='px-6 pt-8'>
					<DialogTitle className='text-center text-2xl font-bold '>
						Account management
					</DialogTitle>
				</DialogHeader>
				<div className='space-y-8 px-6'>
					<DialogDescription className='text-center text-zinc-500'>
						Switch accounts, log in, log out, go all in.
					</DialogDescription>
					<div className=' mt-4 flex items-center justify-between rounded bg-[#F2F3F5] py-2 pl-3 pr-2 dark:bg-[#2B2D31]'>
						<div className='flex items-center'>
							<UserAvatar
								className='size-10'
								imageUrl={user?.image || ''}
								name={user?.name || ''}
							/>
							<div className='ml-2 flex flex-col text-[14px] font-semibold dark:text-zinc-300'>
								<p>{user?.name}</p>
								<p className=' text-green-500'>
									Active account
								</p>
							</div>
						</div>
						<div className='ml-auto'>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical className='size-5 text-zinc-500' />
								</DropdownMenuTrigger>
								<DropdownMenuContent side='bottom'>
									<DropdownMenuItem
										//  onClick={() => handleKick(member.id)}
									>
										<div className='flex items-center cursor-pointer text-sm text-rose-500'>
											<LogOutIcon
												size={18}
												className='mr-2'
											/>
											Log out
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
				<DialogFooter className='bg-gray-100 px-6 py-4'>
					<Button
						className='mx-auto'
						variant='link'
						disabled={isPending}
					>
						{isPending ? <Spinner className='mr-2' /> : null}
						Add Account
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

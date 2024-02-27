'use client'

import { updateServer } from '@/actions/server'
import { FileUpload } from '@/components/file-upload'
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { CustomUserStatusSchema } from '@/schemas'
import { useModal } from '@/store/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Statuses } from '@prisma/client'
import { CleaningDelay } from '@prisma/client'
import { updateCustomUserStatus } from '@/actions/user'
import { useRouter } from 'next/navigation'

const formattedCleaningDelay = [
	{ value: CleaningDelay.FOUR_HOURS, text: '4 hours' },
	{ value: CleaningDelay.ONE_HOUR, text: '1 hour' },
	{ value: CleaningDelay.THIRTY_MINUTE, text: '30 min' },
	{ value: CleaningDelay.DO_NOT_CLEAN, text: 'do not clean' },
]

export const EditUserStatusModal = () => {
	const { isOpen, onClose, type } = useModal()
	const [isPending, startTransition] = useTransition()

	const router = useRouter()

	const isModalOpen = isOpen && type === 'editUserStatus'

	const user = useCurrentUser()

	const form = useForm({
		resolver: zodResolver(CustomUserStatusSchema),
		defaultValues: {
			bio: '',
			type: user?.status || Statuses.ONLINE,
			cleaningDelay: user?.cleaningDelay || CleaningDelay.DO_NOT_CLEAN,
		},
	})

	useEffect(() => {
		if (user && isModalOpen) {
			form.setValue('bio', user.bio)
			form.setValue('type', user.status)
			form.setValue('cleaningDelay', user.cleaningDelay)
		}
	}, [user, form, isModalOpen])

	const onSubmit = async (values: z.infer<typeof CustomUserStatusSchema>) => {
		if (!user) return
		startTransition(() => {
			updateCustomUserStatus(values, user?.id!)
				.then(() => {
					form.reset()
					router.refresh()
					onClose()
					toast.success('Status updated!')
				})
				.catch(() => toast.error('Something went wrong!'))
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
					<DialogTitle className='text-center text-2xl font-bold'>
						Set a custom status
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Set your own status. You can always change it later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<div className='space-y-8 px-6'>
							<FormField
								control={form.control}
								name='bio'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300'>
											How do you feel ?, {user?.name}
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Enter your custom status text'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='cleaningDelay'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300'>
											Clean after
										</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
													<SelectValue placeholder='Select cleaning delay' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{formattedCleaningDelay
													.map((type) => (
														<SelectItem
															key={type.value}
															value={type.value}
															className='capitalize'
														>
															{type.text}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300'>
											Channel Type
										</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
													<SelectValue placeholder='Select a status type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(Statuses).map(
													(type) => (
														<SelectItem
															key={type}
															value={type}
															className='capitalize'
														>
															{type.toLowerCase()}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button variant='primary' disabled={isPending}>
								{isPending
									? <Spinner className='mr-2' />
									: null}
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

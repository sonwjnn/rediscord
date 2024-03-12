'use client'

import { updateUser } from '@/actions/user'
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
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UserSchema } from '@/schemas'
import { useModal } from '@/store/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export const EditProfileModal = () => {
	const { isOpen, onClose, type } = useModal()
	const [isPending, startTransition] = useTransition()
	const user = useCurrentUser()
	const { update } = useSession()

	const isModalOpen = isOpen && type === 'editProfile'

	const form = useForm({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			name: '',
			image: '',
		},
	})

	useEffect(() => {
		if (user && isModalOpen) {
			form.setValue('name', user?.name || '')
			form.setValue('image', user?.image || '')
		}
	}, [user, form, isModalOpen])

	const onSubmit = async (values: z.infer<typeof UserSchema>) => {
		if (!user) return
		startTransition(() => {
			updateUser(values, user?.id as string)
				.then(() => {
					onClose()
					update()
					form.reset()
					toast.success('User updated!')
				})
				.catch(() => toast.error('Something went wrong!'))
		})
	}

	const handleClose = () => {
		onClose()
		setTimeout(() => {
			form.reset()
		}, 200)
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='overflow-hidden bg-white p-0 text-black'>
				<DialogHeader className='px-6 pt-8'>
					<DialogTitle className='text-center text-2xl font-bold'>
						Edit profile
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Give your profile a personality with a name and an
						image. You can always change it later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<div className='space-y-8 px-6'>
							<div className='flex items-center justify-center text-center'>
								<FormField
									control={form.control}
									name='image'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint='userImage'
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300'>
											User name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
												placeholder='Enter user name'
												{...field}
											/>
										</FormControl>
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

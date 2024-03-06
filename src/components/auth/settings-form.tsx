'use client'

import { settings } from '@/actions/settings'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useCurrentUser } from '@/hooks/use-current-user'
import { SettingsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const SettingsForm = () => {
	const user = useCurrentUser()

	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()
	const { update } = useSession()
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
			name: user?.name || undefined,
			email: user?.email || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	})

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error)
					}

					if (data.success) {
						update()
						setSuccess(data.success)
					}
				})
				.catch(() => setError('Something went wrong!'))
		})
	}

	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-center text-2xl font-semibold'>⚙️ Settings</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className='space-y-6'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='John Doe'
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='john.doe@example.com'
														type='email'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='******'
														type='password'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													New Password
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='******'
														type='password'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{user?.isOAuth === false && (
								<FormField
									control={form.control}
									name='isTwoFactorEnabled'
									render={({ field }) => (
										<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
											<div className='space-y-0.5'>
												<FormLabel>
													Two Factor Authentication
												</FormLabel>
												<FormDescription>
													Enable two factor
													authentication for your
													account
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={isPending}
													checked={field.value}
													onCheckedChange={field
														.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							)}
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button disabled={isPending} type='submit'>
							{isPending ? <Spinner className='mr-2' /> : null}
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export default SettingsForm

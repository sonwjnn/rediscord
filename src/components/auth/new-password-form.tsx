'use client'

import { newPassword } from '@/actions/new-password'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NewPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface NewPasswordFormProps {}

export const NewPasswordForm = ({}: NewPasswordFormProps) => {
	const searchParams = useSearchParams()

	const token = searchParams?.get('token')

	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setError(data?.error)
				setSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel='Enter a new password?'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											disabled={isPending}
											placeholder='******'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						type='submit'
						disabled={isPending}
						className='w-full'
					>
						{isPending ? <Spinner className='mr-2' /> : null}
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

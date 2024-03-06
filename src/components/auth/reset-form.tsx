'use client'

import { reset } from '@/actions/reset'
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
import { ResetSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface ResetFormProps {}

export const ResetForm = ({}: ResetFormProps) => {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | undefined>('')
	const [success, setSuccess] = useState<string | undefined>('')

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			reset(values).then((data) => {
				setError(data?.error)
				setSuccess(data?.success)
			})
		})
	}

	return (
		<CardWrapper
			headerLabel='Forgot your password?'
			backButtonLabel="Don't have an account?"
			backButtonHref='/auth/register'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											disabled={isPending}
											placeholder='sonwin@example.com'
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
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

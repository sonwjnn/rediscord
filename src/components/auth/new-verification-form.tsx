'use client'

import { newVerification } from '@/actions/new-verification'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@/components/spinner'

interface NewVerificationFormProps {}

export const NewVerificationForm = ({}: NewVerificationFormProps) => {
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()
	const [email, setEmail] = useState<string | undefined>()

	const searchParams = useSearchParams()

	const token = searchParams?.get('token')

	const onSubmit = useCallback(() => {
		if (success || error) return

		if (!token) {
			setError('Missing token!')
			return
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success)
				setEmail(data.email)
				setError(data.error)
			})
			.catch(() => {
				setError('Something went wrong!')
			})
	}, [token, success, error])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper
			headerLabel='Verify Email'
			headerDescription={`${
				!error
					? `A verification email has been sent to ${
						email || 'your email'
					}. <br/>
          Click the link in the email to verify your account.`
					: ''
			}`}
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
			type='verify-email'
		>
			<div className='flex w-full items-center justify-center'>
				{!success && !error && <Spinner size='icon' />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	)
}

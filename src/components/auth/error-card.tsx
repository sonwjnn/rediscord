import { CardWrapper } from '@/components/auth/card-wrapper'
import { AlertTriangle } from 'lucide-react'

interface ErrorCardProps {}

export const ErrorCard = ({}: ErrorCardProps) => {
	return (
		<CardWrapper
			headerLabel='Oops! something went wrong!'
			headerDescription='Please try again or contact support if the problem persists.'
			backButtonHref='/auth/login'
			backButtonLabel='Back to login'
		>
			<div className='flex w-full items-center justify-center'>
				<AlertTriangle className='text-destructive' />
			</div>
		</CardWrapper>
	)
}

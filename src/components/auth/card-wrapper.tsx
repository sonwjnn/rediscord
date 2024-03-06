import { BackButton } from '@/components/auth/back-button'
import { Header } from '@/components/auth/header'
import { Social } from '@/components/auth/social'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface CardWrapperProps {
	children: React.ReactNode
	headerLabel: string
	headerDescription?: string
	backButtonLabel: string
	backButtonHref: string
	showSocial?: boolean
	type?: 'login' | 'signup' | 'verify-email'
}

export const CardWrapper = ({
	children,
	headerLabel,
	headerDescription = '',
	backButtonHref,
	backButtonLabel,
	showSocial,
	type = 'login',
}: CardWrapperProps) => {
	return (
		<Card className='w-[400px] shadow-md'>
			<CardHeader>
				<Header label={headerLabel} description={headerDescription} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial
				? (
					<CardFooter>
						<Social />
					</CardFooter>
				)
				: null}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref}>
				</BackButton>
			</CardFooter>
		</Card>
	)
}

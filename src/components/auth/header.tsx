import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'

const font = Poppins({
	subsets: ['latin'],
	weight: ['600'],
})

interface HeaderProps {
	label?: string
	description?: string
}

export const Header = ({ label, description }: HeaderProps) => {
	return (
		<div className='flex w-full flex-col items-center justify-center gap-y-4'>
			<h1 className={cn('text-3xl font-semibold', font.className)}>
				{label}
			</h1>
			<p className='text-center text-sm leading-6 text-muted-foreground'>
				{description}
			</p>
		</div>
	)
}

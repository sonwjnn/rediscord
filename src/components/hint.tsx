'use client'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface HintProps {
	label: string
	children: React.ReactNode
	content?: React.ReactNode
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	sideOffset?: number
	className?: string
}

export const Hint = ({
	label,
	content,
	children,
	side,
	align,
	sideOffset,
	className,
}: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					align={align}
					sideOffset={sideOffset}
					className={className}
				>
					<p className='text-sm font-semibold capitalize'>
						{label.toLowerCase()}
					</p>
					{content && <div>{content}</div>}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

'use client'

import { cn } from '@/lib/utils'
import React from 'react'

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {}
const List = ({ children, className, ...props }: ListProps) => {
	return (
		<ul className={cn(className)} {...props}>
			{children}
		</ul>
	)
}

export type PopupItemProps = {
	active?: boolean
	noVerticalPadding?: boolean
} & React.ButtonHTMLAttributes<HTMLDivElement>
const PopupItem = React.forwardRef(
	(
		{ active, noVerticalPadding, className, ...props }: PopupItemProps,
		ref: React.Ref<HTMLLIElement>,
	) => {
		return (
			<li className='list-none' ref={ref}>
				<div
					className={cn(
						'flex w-full cursor-pointer items-center rounded-md pl-3 pr-2 text-left text-[15px]  text-zinc-500 transition hover:bg-zinc-700/10  hover:text-zinc-600 focus-visible:bg-gray-800/50 focus-visible:text-gray-100  focus-visible:ring-0 dark:text-zinc-400 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-300',
						noVerticalPadding ? '' : 'py-2',
						active
							? 'text-zinc-200 dark:bg-gray-700/60 '
							: 'text-zinc-500 dark:text-zinc-400',
						className,
					)}
					{...props}
				/>
			</li>
		)
	},
)

PopupItem.displayName = 'PopupItemm'

export { List, PopupItem }

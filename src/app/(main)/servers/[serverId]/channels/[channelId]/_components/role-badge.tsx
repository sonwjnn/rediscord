import { cn } from '@/lib/utils'
import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

interface RoleBadgeProps {
	className?: string
	role: MemberRole
}
const roleMap = {
	GUEST: {
		icon: <div className='rounded-full size-3 bg-zinc-400' />,
		value: 'member',
	},
	MODERATOR: {
		icon: <ShieldCheck className='size-4 text-indigo-500' />,
		value: 'moderator',
	},
	ADMIN: {
		icon: <ShieldAlert className='size-4 text-rose-500' />,
		value: 'admin',
	},
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
	return (
		<div
			className={cn(
				'rounded-sm bg-[#] bg-zinc-200  dark:bg-[#212228] p-1 px-1.5 text-center text-[10px] font-semibold uppercase tracking-wide flex gap-x-1.5 ',
				className,
			)}
		>
			<div className='flex items-center'>
				{roleMap[role].icon}
			</div>
			<p className='capitalize'>
				{roleMap[role]?.value.toLowerCase()}
			</p>
		</div>
	)
}

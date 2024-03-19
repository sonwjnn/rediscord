import { cn } from '@/lib/utils'
import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

interface RoleBadgeProps {
	className?: string
	role: MemberRole
}
const roleMap = {
	GUEST: <div className='rounded-full size-3 bg-zinc-400' />,
	MODERATOR: <ShieldCheck className='size-4 text-indigo-500' />,
	ADMIN: <ShieldAlert className='size-4 text-rose-500' />,
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
	return (
		<div
			className={cn(
				'rounded-sm bg-[#] bg-zinc-200  dark:bg-[#212228] p-1 px-1.5 pr-2 text-center text-[10px] font-semibold uppercase tracking-wide flex gap-x-1.5 ',
				className,
			)}
		>
			<div className='flex items-center'>
				{roleMap[role]}
			</div>
			<p className='capitalize '>
				{role.toLowerCase()}
			</p>
		</div>
	)
}

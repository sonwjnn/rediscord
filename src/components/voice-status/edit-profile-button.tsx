'use client'

import { useModal } from '@/store/use-modal-store'
import { PiPencilSimpleFill } from 'react-icons/pi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditProfileButtonProps {
	className?: string
}

export const EditProfileButton = ({ className }: EditProfileButtonProps) => {
	const { onOpen } = useModal()

	return (
		<Button
			onClick={() => onOpen('editProfile')}
			size='icon'
			variant='ghost'
			className={cn('bg-black/60 size-8 rounded-full', className)}
		>
			<PiPencilSimpleFill
				size={20}
				className='text-black dark:text-white'
			/>
		</Button>
	)
}

'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import {
	UserButton,
	UserButtonSkeleton,
} from '@/components/voice-status/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { VoiceStatus as VoiceStatusType } from '@/types'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import { Controls, ControlsSkeleton } from './controls'
import { useOrigin } from '@/hooks/use-origin'

export const VoiceStatus = () => {
	const origin = useOrigin()
	const [voiceStatus, setVoiceStatus] = useState<VoiceStatusType>({
		mute: true,
	})
	const user = useCurrentUser()

	if (!user) return redirect('/')

	if (!origin) return <VoiceStatusSkeleton />

	return (
		<TooltipProvider>
			<div className='flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]'>
				<UserButton />
				<Controls
					voiceStatus={voiceStatus}
					setVoiceStatus={setVoiceStatus}
				/>
			</div>
		</TooltipProvider>
	)
}

export const VoiceStatusSkeleton = () => {
	return (
		<div className='flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]'>
			<UserButtonSkeleton />
			<ControlsSkeleton />
		</div>
	)
}

'use client'

import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  UserButton,
  UserButtonSkeleton,
} from '@/components/voice-status/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { t } from '@/lib/i18n'
import { VoiceStatus as VoiceStatusType } from '@/types'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useIsClient } from 'usehooks-ts'

import { Controls, ControlsSkeleton } from './controls'

export const VoiceStatus = () => {
  const isClient = useIsClient()
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatusType>({
    mute: true,
  })
  const user = useCurrentUser()

  if (!user) return redirect('/')

  if (!isClient) return <VoiceStatusSkeleton />

  return (
    <TooltipProvider>
      <div className="flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]">
        <UserButton />
        <Controls voiceStatus={voiceStatus} setVoiceStatus={setVoiceStatus} />
      </div>
    </TooltipProvider>
  )
}

export const VoiceStatusSkeleton = () => {
  return (
    <div className="flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]">
      <UserButtonSkeleton />
      <ControlsSkeleton />
    </div>
  )
}

'use client'

import { UserButton, UserButtonSkeleton } from '@/components/auth/user-button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useCurrentUser } from '@/hooks/use-current-user'
import { t } from '@/lib/i18n'
import { VoiceStatus } from '@/types'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useIsClient } from 'usehooks-ts'

import { VoiceControls, VoiceControlsSkeleton } from './voice-status-controls'
import PopoverContentMain from './voice-status-popover-content-main'

export const VoiceStatusFooter = () => {
  const isClient = useIsClient()
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ mute: true })
  const user = useCurrentUser()

  if (!user) return redirect('/')

  if (!isClient) return <VoiceStatusFooterSkeleton />

  return (
    <TooltipProvider>
      <div className="flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]">
        <UserButton />
        <VoiceControls
          voiceStatus={voiceStatus}
          setVoiceStatus={setVoiceStatus}
        />
      </div>
      {/* <PopoverContentMain
            // setUser={setUser}
            // user={user}
          /> */}
    </TooltipProvider>
  )
}

export const VoiceStatusFooterSkeleton = () => {
  return (
    <div
      className={
        'flex justify-between bg-[#ebedef] px-2 py-1.5 dark:bg-[#232428]'
      }
    >
      <UserButtonSkeleton />
      <VoiceControlsSkeleton />
    </div>
  )
}

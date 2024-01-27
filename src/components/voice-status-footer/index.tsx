'use client'

import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useCurrentUser } from '@/hooks/use-current-user'
import { t } from '@/lib/i18n'
import { VoiceStatus } from '@/types'
import { useEffect, useState } from 'react'

import { UserButton } from '../auth/user-button'
import VoiceControls from './voice-status-controls'
import PopoverContentMain from './voice-status-popover-content-main'

export default function VoiceStatusFooter() {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ mute: true })
  const user = useCurrentUser()

  return (
    <TooltipProvider>
      {user ? (
        <Popover>
          <div className="flex justify-between gap-1 bg-[#232428] px-2 py-1.5">
            <PopoverTrigger asChild>
              <button className="flex gap-2 rounded-md py-1 pl-0.5 pr-2 text-left leading-tight hover:bg-white/20">
                <UserButton />
              </button>
            </PopoverTrigger>
            <VoiceControls
              voiceStatus={voiceStatus}
              setVoiceStatus={setVoiceStatus}
            />
          </div>
          {/* <PopoverContentMain
            // setUser={setUser}
            // user={user}
          /> */}
        </Popover>
      ) : null}
    </TooltipProvider>
  )
}

import { cn } from '@/lib/utils'
import React from 'react'
import { BsGearFill, BsHeadphones, BsMicFill } from 'react-icons/bs'

import { ActionTooltip } from '../action-tooltip'
import VoiceStatusButton from './voice-status-button'

interface VoiceControlsProps {
  voiceStatus: {
    mute?: boolean
    deaf?: boolean
  }
  setVoiceStatus: (
    statusUpdater: (prev: { mute?: boolean; deaf?: boolean }) => {
      mute?: boolean
      deaf?: boolean
    }
  ) => void
}
function VoiceControls({ voiceStatus, setVoiceStatus }: VoiceControlsProps) {
  const toggleMute = () => {
    setVoiceStatus(prev => ({
      ...prev,
      mute: !prev?.mute,
    }))
  }

  const toggleDeaf = () => {
    setVoiceStatus(prev => ({
      ...prev,
      deaf: !prev?.deaf,
    }))
  }

  const muteTooltipText =
    voiceStatus.mute || voiceStatus.deaf ? 'Unmute' : 'Mute'
  const deafTooltipText = voiceStatus.deaf ? 'Undeaf' : 'Deaf'

  return (
    <div className="flex items-center">
      <ActionTooltip label={muteTooltipText}>
        <button
          onClick={toggleMute}
          className={cn(
            'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-700',
            'text-gray-300 hover:text-gray-200'
          )}
        >
          <BsMicFill fontSize={18} />
          {voiceStatus.mute ||
            (voiceStatus.deaf && (
              <div className="border-semibackground absolute h-3/4 w-[5px] rotate-45 rounded-sm border-[2px] bg-red-500 group-hover:border-gray-700"></div>
            ))}
        </button>
      </ActionTooltip>

      <ActionTooltip label={deafTooltipText}>
        <button
          onClick={toggleDeaf}
          className={cn(
            'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-700',
            'text-gray-300 hover:text-gray-200'
          )}
        >
          <BsHeadphones fontSize={20} />
          {voiceStatus.deaf && (
            <div className="border-semibackground absolute h-3/4 w-[5px] rotate-45 rounded-sm border-[2px] bg-red-500 group-hover:border-gray-700"></div>
          )}
        </button>
      </ActionTooltip>

      <ActionTooltip label="Settings">
        <button
          className={cn(
            'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-700',
            'text-gray-300 hover:text-gray-200'
          )}
        >
          <BsGearFill fontSize={18} />
        </button>
      </ActionTooltip>
    </div>
  )
}

export default VoiceControls

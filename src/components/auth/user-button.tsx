'use client'

import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { UserAvatar } from '@/components/user-avatar'
import VoiceControls from '@/components/voice-status-footer/voice-status-controls'
import PopoverContentMain from '@/components/voice-status-footer/voice-status-popover-content-main'
import { useCurrentUser } from '@/hooks/use-current-user'
import { t } from '@/lib/i18n'
import { useRouter } from 'next/navigation'

export const UserButton = () => {
  const router = useRouter()
  const user = useCurrentUser()

  if (!user) return null

  return (
    <Popover>
      <div className="bg-semibackground flex justify-between gap-1 px-2 py-1.5">
        <PopoverTrigger asChild>
          <button className="flex gap-2 rounded-md py-1 pl-0.5 pr-2 text-left leading-tight hover:bg-white/20">
            <UserAvatar imageUrl={user?.image || ''} name={user?.name || ''} />
            <div>
              <div className="text-xs font-semibold">{user?.name}</div>
              <div className="text-[11px] text-gray-300">
                {t(`user.status.Online`)}
              </div>
            </div>
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContentMain setCurrentUser={() => {}} />
    </Popover>
  )
}

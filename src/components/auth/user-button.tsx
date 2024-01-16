'use client'

import { LogoutButton } from '@/components/auth/logout-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Clapperboard, DoorOpen, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { UserAvatar } from '../user-avatar'
import { SettingsButton } from './settings-button'

export const UserButton = () => {
  const router = useRouter()
  const user = useCurrentUser()

  const onDasboardClick = () => {
    router.push(`/u/${user?.name}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar imageUrl={user?.image!} name={user?.name!} size="md" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex  gap-x-2 p-2">
          <UserAvatar imageUrl={user?.image!} name={user?.name!} size="lg" />

          <div className="flex min-w-0 flex-col justify-center">
            <h3 className="truncate text-base font-semibold">{user?.name}</h3>
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <Separator />

        <DropdownMenuItem
          className="cursor-pointer px-4 py-3"
          onClick={onDasboardClick}
        >
          <Clapperboard className="mr-2 size-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem className="px-4 py-3">
          <SettingsButton className="flex w-full">
            <Settings className="mr-2 mt-0.5 size-4" />
            Manage account
          </SettingsButton>
        </DropdownMenuItem>

        <Separator />
        <DropdownMenuItem className="px-4 py-3 focus:bg-red-400 focus:bg-opacity-10 focus:text-red-500">
          <LogoutButton className="flex w-full">
            <DoorOpen className="mr-2 mt-0.5 size-4" />
            Logout
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

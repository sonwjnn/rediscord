'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/store/use-modal-store';
import { ServerWithMembersWithUsers } from '@/types';
import { MemberRole } from '@prisma/client';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';

import { HeaderDropdownItem } from './header-dropdown-item';


interface HeaderProps {
  server: ServerWithMembersWithUsers
  role?: MemberRole
}

export const Header = ({ server, role }: HeaderProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          {isDropdownOpen ? <X className="ml-auto size-4" /> : <ChevronDown className="ml-auto size-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#111214] space-y-[2px] p-1.5 text-xs font-medium text-black dark:text-neutral-400">
        {isModerator && (
          <HeaderDropdownItem
            label="Invite People"
            onClick={() => onOpen('invite', { server })}
            className="text-indigo-600 dark:text-indigo-400"
            icon={UserPlus}
          />
        )}
        {isAdmin && (
          <HeaderDropdownItem
            label="Server Settings"
            onClick={() => onOpen('editServer', { server })}
            icon={Settings}
          />
        )}
        {isAdmin && (
          <HeaderDropdownItem
            label="Manage Members"
            onClick={() => onOpen('members', { server })}
            icon={Users}
          />
        )}
        {isModerator && (
          <HeaderDropdownItem
            label="Create Channel"
            onClick={() => onOpen('createChannel', { server })}
            icon={PlusCircle}
          />
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <HeaderDropdownItem
            className='text-rose-500 hover:!bg-rose-600'
            label="Delete Server"
            onClick={() => onOpen('deleteServer', { server })}
            icon={Trash}
          />
        )}
        {!isAdmin && (
          <HeaderDropdownItem
            className='text-rose-500 hover:!bg-rose-600'
            label="Leave Server"
            onClick={() => onOpen('leaveServer', { server })}
            icon={LogOut}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const HeaderSkeleton = () => {
  return (
    <div className=" flex h-12 w-full items-center justify-between border-b-2 border-neutral-200 px-3 transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
      <Skeleton className="h-6 w-[100px]" />
      <Skeleton className="size-6" />
    </div>
  )
}
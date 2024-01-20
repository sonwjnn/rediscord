import { UserButton } from '@/components/auth/user-button'
import { ModeToggle } from '@/components/mode-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getSeversByProfileId } from '@/data/server'
import { currentProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'

import { Actions } from './actions'
import { Item } from './item'

export const Navbar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const servers = await getSeversByProfileId(profile.id)

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
      <Actions />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {servers.map(server => (
          <div key={server.id} className="mb-4">
            <Item id={server.id} name={server.name} imageUrl={server.image} />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}

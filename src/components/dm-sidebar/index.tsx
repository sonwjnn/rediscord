
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getConversationsByUserId } from '@/data/direct-message'
import { currentUser } from '@/lib/auth'
import { MOCK_CHANNELS, MOCK_MEMBER } from '@/lib/mock'
import { redirect } from 'next/navigation'

import { DMItem, DMItemSkeleton } from './dm-item'
import { HeaderSkeleton } from './header'
import { Search, SearchSkeleton } from './search'
import { Section } from './section'
import { FaUserFriends } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";

export const DMSidebar = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    return redirect('/')
  }

  const conversations = await getConversationsByUserId(user.id)

  if (!conversations) {
    return redirect('/')
  }

  const formattedData = conversations.map(item => ({
    ...item,
    user: item.userOne.id !== user.id ? item.userOne : item.userTwo,
  }))

  return (
    <aside className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      {/* <Header server={server} role={role} /> */}
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <Search
            data={
              [
                // {
                //   label: 'Text Channels',
                //   type: 'channel',
                //   data: textChannels?.map(channel => ({
                //     id: channel.id,
                //     name: channel.name,
                //     icon: iconMap[channel.type],
                //   })),
                // },
                // {
                //   label: 'Voice Channels',
                //   type: 'channel',
                //   data: audioChannels?.map(channel => ({
                //     id: channel.id,
                //     name: channel.name,
                //     icon: iconMap[channel.type],
                //   })),
                // },
                // {
                //   label: 'Video Channels',
                //   type: 'channel',
                //   data: videoChannels?.map(channel => ({
                //     id: channel.id,
                //     name: channel.name,
                //     icon: iconMap[channel.type],
                //   })),
                // },
                // {
                //   label: 'Members',
                //   type: 'member',
                //   data: members?.map(member => ({
                //     id: member.id,
                //     name: member.user.name || '',
                //     icon: roleIconMap[member.role],
                //   })),
                // },
              ]
            }
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

        <div className="space-y-1.5">
        <Section
          label="Friends"
          href="/me"
          icon={<FaUserFriends className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"/>}
        />

        <Section
          label="Nitro"
          href="/nitro"
          icon={<RiVipCrownFill className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"/>}
          disabled
        />
        </div>
        

          <div className="mb-2">
            <div className="flex items-center justify-between py-2">
              <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                Direct Messages
              </p>
              {/* <Hint label="Create DM" side="top">
                <button className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300">
                  <Plus className="size-4" />
                </button>
              </Hint> */}
            </div>
            <div className="space-y-0.5">
              {formattedData.map(item => (
                <DMItem key={item.id} user={item.user} />
              ))}
            </div>
          </div>
      </ScrollArea>
    </aside>
  )
}

const SectionSkeleton = ({ type }: { type: 'channel' | 'member' }) => {
  return (
    <>
      <div className="mb-1 px-2">
        <Skeleton className="h-3 w-20 " />
      </div>
      <ul className="space-y-[2px]">
        {type === 'member' && (
          <>
            {[...Array(MOCK_MEMBER)].map((_, i) => (
              <DMItemSkeleton key={i} />
            ))}
          </>
        )}
      </ul>
    </>
  )
}

export const DMSidebarSkeleton = () => {
  return (
    <aside className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <HeaderSkeleton />
      <div className="mt-2">
        <SearchSkeleton />
      </div>

      <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

      <div className="space-y-2">
        {[...Array(MOCK_CHANNELS)].map((_, i) => (
          <SectionSkeleton type="channel" key={i} />
        ))}

        <SectionSkeleton type="member" />
      </div>
    </aside>
  )
}

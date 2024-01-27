import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getServerWithChannelsWithMembers } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { MOCK_CHANNELS, MOCK_MEMBER } from '@/lib/mock'
import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { redirect } from 'next/navigation'

import { ServerChannel, ServerChannelSkeleton } from './channel'
import { Header, HeaderSkeleton } from './header'
import { ServerMember, ServerMemberSkeleton } from './member'
import { Search, SearchSkeleton } from './search'
import { Section } from './section'

interface SidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
}

export const Sidebar = async ({ serverId }: SidebarProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const server = await getServerWithChannelsWithMembers(serverId)

  if (!server) {
    return redirect('/')
  }

  const textChannels = server?.channels.filter(
    channel => channel.type === ChannelType.TEXT
  )
  const audioChannels = server?.channels.filter(
    channel => channel.type === ChannelType.AUDIO
  )
  const videoChannels = server?.channels.filter(
    channel => channel.type === ChannelType.VIDEO
  )
  const members = server?.members.filter(member => member.userId !== user.id)

  const role = server.members.find(member => member.userId === user.id)?.role

  return (
    <aside className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <Header server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <Search
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.user.name || '',
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.TEXT}
              server={server}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {/* {!!members?.length && (
          <div className="mb-2">
            <Section
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map(member => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )} */}
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
        {type === 'channel' && (
          <>
            {[...Array(2)].map((_, i) => (
              <ServerChannelSkeleton key={i} />
            ))}
          </>
        )}

        {type === 'member' && (
          <>
            {[...Array(MOCK_MEMBER)].map((_, i) => (
              <ServerMemberSkeleton key={i} />
            ))}
          </>
        )}
      </ul>
    </>
  )
}

export const SidebarSkeleton = () => {
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

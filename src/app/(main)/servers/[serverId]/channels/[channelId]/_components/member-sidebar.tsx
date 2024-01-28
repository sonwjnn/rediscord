import { Section } from '@/components/sidebar/section'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCurrentUser } from '@/hooks/use-current-user'
import { MemberWithUser, ServerWithMembersWithUsers } from '@/types'
import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

import { MemberItem, MemberItemSkeleton } from './member-item'

interface MemberSidebarProps {
  server: ServerWithMembersWithUsers
  members: MemberWithUser[]
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
}

export const MemberSidebar = ({ server, members }: MemberSidebarProps) => {
  const user = useCurrentUser()
  // const server = await getServerWithChannelsWithMembers(serverId)

  // if (!user) {
  //   return null
  // }

  // if (!server) {
  //   return null
  // }

  // const members = server?.members.filter(
  //   member => member.userId !== user.id
  // )

  const role = server.members.find(member => member.userId === user?.id)?.role
  return (
    <aside className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <Section
            sectionType="members"
            role={role}
            label="Members"
            server={server}
          />
          <div className="space-y-2">
            {!!members
              ? members.map(member => (
                  <MemberItem key={member.id} member={member} server={server} />
                ))
              : null}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

export const MemberSidebarSkeleton = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <MemberItemSkeleton key={i} />
    ))}
  </>
)

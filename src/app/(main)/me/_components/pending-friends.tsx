'use client'

import { useGetPendingReq } from '@/features/friends/api/use-get-pending-req'
import { useFriendSocket } from '@/hooks/use-friend-socket'
import { LoaderIcon } from 'lucide-react'

import { PendingList } from './pending-list'

const PendingFriends = () => {
  const { data: friends, isLoading } = useGetPendingReq()

  useFriendSocket({
    addKey: 'friend:add',
    updateKey: 'friend:update',
    queryKey: 'pending-req',
  })

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6">
      <PendingList
        incoming={friends?.incoming ?? []}
        outgoing={friends?.outgoing ?? []}
      />
    </div>
  )
}
export default PendingFriends

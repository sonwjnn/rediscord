import { Suspense } from 'react'

import AddFriend from './_components/add-friend'
import AllFriends from './_components/all-friends'
import Header from './_components/header'
import OnlineFriends from './_components/online-friends'
import PendingFriends from './_components/pending-friends'
import { TabsType } from './types'

const FriendLayout = async ({
  searchParams,
}: {
  searchParams: Promise<{ tabs?: string }>
}) => {
  const { tabs } = await searchParams

  const tab = (tabs as TabsType) || 'ONLINE'

  const renderContent = () => {
    switch (tab) {
      case 'ONLINE':
        return <OnlineFriends />
      case 'ALL':
        return <AllFriends />
      case 'PENDING':
        return <PendingFriends />
      case 'ADD_FRIEND':
        return <AddFriend />
      default:
        return <OnlineFriends />
    }
  }

  return (
    <div className="flex flex-col">
      <Header />
      {renderContent()}
    </div>
  )
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ tabs?: string }>
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FriendLayout searchParams={searchParams} />
    </Suspense>
  )
}

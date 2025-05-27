'use client'

import { useGetOnlineFriends } from '@/features/friends/api/use-get-online-friends'
import { useFriendSocket } from '@/hooks/use-friend-socket'
import { LoaderIcon, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Section } from './section'
import { UserItem } from './user-item'

const OnlineFriends = () => {
  const { data: friends, isLoading } = useGetOnlineFriends()
  const [searchQuery, setSearchQuery] = useState('')

  useFriendSocket({
    addKey: 'friend:add',
    updateKey: 'friend:update',
    queryKey: 'online-friends',
  })

  const filteredFriends = useMemo(() => {
    if (!friends) return []
    if (!searchQuery.trim()) return friends

    return friends.filter(friend =>
      friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [friends, searchQuery])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-medium text-zinc-600 dark:text-zinc-200">
          No Online Friends
        </h3>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">
          None of your friends are currently online
        </p>
        <Link
          href="/me?tabs=ADD_FRIEND"
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          Add Some Friends
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6">
      <div className="relative mb-4 flex h-10">
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pl-3">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search online friends"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-md bg-[#1e1f22] py-2 pl-3 pr-4 text-neutral-300 focus-visible:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200"
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>

      <Section label={`online - ${filteredFriends.length}`} />

      {filteredFriends.length > 0 ? (
        filteredFriends.map(item => (
          <UserItem
            key={item.userId}
            username={item.name || ''}
            userStatus={item.status}
            imageUrl={item.image || ''}
            userId={item.userId}
            friendId={item.id || ''}
          />
        ))
      ) : (
        <div className="py-6 text-center text-zinc-400">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  )
}

export default OnlineFriends

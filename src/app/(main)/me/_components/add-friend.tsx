'use client'

import { useSendFriendRequest } from '@/features/friends/api/use-friend-actions'
import { useState } from 'react'
import { toast } from 'sonner'

const AddFriend = () => {
  const [username, setUsername] = useState('')
  const sendFriendMutation = useSendFriendRequest()

  const onSendFriendReq = () => {
    if (!username.trim()) {
      return toast.error('Please enter a username')
    }

    sendFriendMutation.mutate(username, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success)
          setUsername('') // Clear input after successful send
        }
      },
    })
  }

  return (
    <div className="mt-6 flex flex-col px-6">
      <h1 className="text-base font-semibold text-zinc-600 dark:text-white">
        ADD FRIEND
      </h1>
      <p className="my-2 text-base font-medium text-zinc-500 dark:text-zinc-400">
        You can add friends with their Discord username.
      </p>
      <form
        className="relative mb-4 flex h-12"
        onSubmit={e => {
          e.preventDefault()
          onSendFriendReq()
        }}
      >
        <input
          type="text"
          placeholder="You can add friends with their Discord username."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="flex-1 rounded-lg border-0 bg-zinc-100 p-2 px-4 text-zinc-500 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0 dark:bg-[#1e1f22] dark:text-neutral-300"
        />
        <button
          type="submit"
          disabled={sendFriendMutation.isPending || !username.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Send friend request
        </button>
      </form>
    </div>
  )
}

export default AddFriend

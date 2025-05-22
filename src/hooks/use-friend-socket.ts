import { useSocket } from '@/providers/socket-provider'
import { Friend, User } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type FriendSocketProps = {
  addKey: string
  updateKey: string
  queryKey: string
}

type FriendWithUser = Friend & {
  userOne: User
  userTwo: User
}

export const useFriendSocket = ({
  addKey,
  updateKey,
  queryKey,
}: FriendSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    // Handle friend request updates (accept/reject/cancel/delete)
    socket.on(updateKey, (friend: FriendWithUser) => {
      queryClient?.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: FriendWithUser) => {
              if (item.id === friend.id) {
                return friend
              }
              return item
            }),
          }
        })

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    // Handle new friend requests
    socket.on(addKey, (friend: FriendWithUser) => {
      console.log(`socket: ${queryKey}`)

      queryClient?.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [friend],
              },
            ],
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [friend, ...newData[0].items],
        }

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, queryKey, socket, updateKey])
} 
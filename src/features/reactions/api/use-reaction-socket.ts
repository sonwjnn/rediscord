import { useSocket } from '@/providers/socket-provider'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

type ReactionSocketProps = {
  addKey: string
  removeKey: string
  queryKey: string
  type: 'server' | 'conversation'
}

type Payload = {
  messageId: string
  reactionId: string
  emoji: string
  userId?: string
  memberId?: string
}

export const useReactionSocket = ({
  addKey,
  removeKey,
  queryKey,
  type,
}: ReactionSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on(addKey, (payload: Payload) => {
      const { reactionId, emoji, userId, memberId, messageId } = payload

      if (type === 'server') {
        queryClient?.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [],
                },
              ],
            }
          }

          const newPages = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.items.map((item: any) => {
                if (item.id === messageId) {
                  const existingReaction = (item.reactions || []).find(
                    (r: any) => r.emoji === emoji
                  )

                  if (existingReaction) {
                    // Update existing reaction
                    return {
                      ...item,
                      reactions: (item.reactions || []).map((r: any) => {
                        if (r.emoji === emoji) {
                          return {
                            ...r,
                            count: r.count + 1,
                            memberIds: [...(r.memberIds || []), memberId!],
                          }
                        }
                        return r
                      }),
                    }
                  } else {
                    // Add new reaction
                    return {
                      ...item,
                      reactions: [
                        ...(item.reactions || []),
                        {
                          id: reactionId,
                          emoji,
                          messageId,
                          count: 1,
                          memberIds: [memberId!],
                        },
                      ],
                    }
                  }
                }
                return item
              }),
            }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        })
      }

      if (type === 'conversation') {
        queryClient?.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [],
                },
              ],
            }
          }

          const message = oldData.items.find(
            (item: any) => item.id === messageId
          )

          if (message) {
            return {
              ...oldData,
              items: oldData.items.map((item: any) => {
                if (item.id === messageId) {
                  return {
                    ...item,
                    reactions: [
                      ...item.reactions,
                      {
                        id: reactionId,
                        emoji,
                        userId,
                      },
                    ],
                  }
                }
                return item
              }),
            }
          }

          if (userId) {
            return {
              ...oldData,
              items: [
                ...oldData.items,
                {
                  id: reactionId,
                  emoji,
                  userId,
                },
              ],
            }
          }
        })
      }
    })

    socket.on(removeKey, (payload: Payload) => {
      const { reactionId, emoji, userId, memberId, messageId } = payload

      if (type === 'server') {
        queryClient?.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [],
                },
              ],
            }
          }

          const newPages = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.items.map((item: any) => {
                if (item.id === messageId) {
                  const existingReaction = (item.reactions || []).find(
                    (r: any) => r.emoji === emoji
                  )

                  if (existingReaction) {
                    const updatedMemberIds = (
                      existingReaction.memberIds || []
                    ).filter((id: string) => id !== memberId)
                    const updatedCount = existingReaction.count - 1

                    if (updatedCount <= 0) {
                      // Remove reaction if count is 0
                      console.log({
                        ...item,
                        reactions: (item.reactions || []).filter(
                          (r: any) => r.emoji !== emoji
                        ),
                      })
                      return {
                        ...item,
                        reactions: (item.reactions || []).filter(
                          (r: any) => r.emoji !== emoji
                        ),
                      }
                    } else {
                      // Update existing reaction
                      return {
                        ...item,
                        reactions: (item.reactions || []).map((r: any) => {
                          if (r.emoji === emoji) {
                            return {
                              ...r,
                              count: updatedCount,
                              memberIds: updatedMemberIds,
                            }
                          }
                          return r
                        }),
                      }
                    }
                  }
                }
                return item
              }),
            }
          })

          return {
            ...oldData,
            pages: newPages,
          }
        })
      }

      if (type === 'conversation') {
        queryClient?.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [],
                },
              ],
            }
          }

          return {
            ...oldData,
            items: oldData.items.map((item: any) => {
              if (item.id === messageId) {
                return {
                  ...item,
                  reactions: (item.reactions || []).filter(
                    (reaction: any) =>
                      !(
                        reaction.id === reactionId && reaction.userId === userId
                      )
                  ),
                }
              }
              return item
            }),
          }
        })
      }
    })

    return () => {
      socket.off(addKey)
      socket.off(removeKey)
    }
  }, [queryClient, addKey, removeKey, queryKey, socket])
}

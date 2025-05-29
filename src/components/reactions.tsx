import { cn } from '@/lib/utils'
import { ConversationReaction, ServerReaction } from '@prisma/client'
import { MdOutlineAddReaction } from 'react-icons/md'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'

type ServerReactionType = Array<
  Omit<ServerReaction, 'memberId'> & {
    count: number
    memberIds: string[]
  }
>

type ConversationReactionType = Array<
  Omit<ConversationReaction, 'userId'> & {
    count: number
    memberIds: string[]
  }
>

interface ReactionsProps {
  serverData?: ServerReactionType
  conversationData?: ConversationReactionType
  currentMemberId?: string
  currentUserId?: string
  type: 'server' | 'conversation'
  onChange: (value: string) => void
}

export const Reactions = ({
  serverData,
  conversationData,
  currentMemberId,
  currentUserId,
  type,
  onChange,
}: ReactionsProps) => {
  if ((type === 'server' && serverData?.length === 0) || !currentMemberId) {
    return null
  }

  if (
    (type === 'conversation' && conversationData?.length === 0) ||
    !currentUserId
  ) {
    return null
  }

  const data = type === 'server' ? serverData : conversationData

  return (
    <div className="mb-1 mt-1 flex w-full items-center gap-1">
      {data?.map(reaction => (
        <Hint
          key={reaction.id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.emoji}`}
        >
          <button
            className={cn(
              'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800 dark:bg-zinc-800 dark:text-slate-200',
              (type === 'server' &&
                reaction.memberIds?.includes(currentMemberId)) ||
                (type === 'conversation' &&
                  reaction.memberIds?.includes(currentUserId) &&
                  'border-blue-500 bg-blue-100/70 text-blue-500 dark:border-blue-500 dark:bg-blue-500/70 dark:text-white')
            )}
            onClick={() => onChange(reaction.emoji)}
          >
            {reaction.emoji}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground dark:text-muted-foreground',
                (type === 'server' &&
                  reaction.memberIds?.includes(currentMemberId)) ||
                  (type === 'conversation' &&
                    reaction.memberIds?.includes(currentUserId) &&
                    'text-blue-500 dark:text-white')
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={emoji => onChange(emoji)}
      >
        <button className="flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500 dark:bg-zinc-800 dark:text-zinc-500">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  )
}

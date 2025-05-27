import { useServerId } from '@/hooks/use-server-id'
import { cn } from '@/lib/utils'
import { ServerReaction } from '@prisma/client'
import { MdOutlineAddReaction } from 'react-icons/md'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'

interface ReactionsProps {
  data: Array<
    Omit<ServerReaction, 'memberId'> & {
      count: number
      memberIds: string[]
    }
  >
  currentMemberId?: string
  onChange: (value: string) => void
}

export const ServerReactions = ({
  data,
  currentMemberId,
  onChange,
}: ReactionsProps) => {
  const serverId = useServerId()

  if (data.length === 0 || !currentMemberId) {
    return null
  }

  return (
    <div className="mb-1 mt-1 flex w-full items-center gap-1">
      {data.map(reaction => (
        <Hint
          key={reaction.id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.emoji}`}
        >
          <button
            className={cn(
              'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800 dark:bg-zinc-800 dark:text-slate-200',
              currentMemberId &&
                reaction.memberIds?.includes(currentMemberId) &&
                'border-blue-500 bg-blue-100/70 text-blue-500 dark:border-blue-500 dark:bg-blue-500/70 dark:text-white'
            )}
            onClick={() => onChange(reaction.emoji)}
          >
            {reaction.emoji}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground dark:text-muted-foreground',
                currentMemberId &&
                  reaction.memberIds?.includes(currentMemberId) &&
                  'text-blue-500 dark:text-white'
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

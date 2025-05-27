import { Edit, Smile, Trash } from 'lucide-react'

import { EmojiPopover } from '../emoji-popover'
import { Hint } from '../hint'
import { Button } from '../ui/button'

type Props = {
  canDelete: boolean
  canEdit: boolean
  isPending: boolean
  onEdit: () => void
  onDelete: () => void
  onReaction: (emoji: string) => void
}

export const Toolbar = ({
  canDelete,
  canEdit,
  isPending,
  onEdit,
  onDelete,
  onReaction,
}: Props) => {
  return (
    <div className="absolute -top-2 right-5 flex items-center gap-x-2 rounded-sm border bg-white p-1 dark:bg-zinc-800">
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={emoji => onReaction(emoji)}
      >
        <Button size="iconSm" variant="ghost" disabled={isPending}>
          <Smile className="size-4" />
        </Button>
      </EmojiPopover>
      {canEdit && (
        <Hint label="Edit">
          <Edit
            onClick={onEdit}
            className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
          />
        </Hint>
      )}
      {canDelete && (
        <Hint label="Delete">
          <Trash
            onClick={onDelete}
            className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
          />
        </Hint>
      )}
    </div>
  )
}

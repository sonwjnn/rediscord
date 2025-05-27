import { Edit, Pencil, Smile, Trash } from 'lucide-react'

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
    <div className="absolute -top-2 right-5">
      <div className="rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-zinc-800">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={emoji => onReaction(emoji)}
        >
          <Button size="iconSm" variant="ghost" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {canEdit && (
          <Hint label="Edit message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={onEdit}
            >
              <Pencil className="size-4 text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
            </Button>
          </Hint>
        )}
        {canDelete && (
          <Hint label="Delete message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
              onClick={onDelete}
            >
              <Trash className="size-4 text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
}

'use client'

import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { useDeleteFriend } from '@/features/friends/api/use-friend-actions'
import { useConfirm } from '@/hooks/use-confirm'
import { t } from '@/lib/i18n'
import { UserX, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

type UserItemProps = {
  username: string
  imageUrl: string
  userStatus: any
  userId: string
  friendId: string // Add friendId prop to enable deletion
}

export const UserItem = ({
  userId,
  username,
  imageUrl,
  userStatus,
  friendId,
}: UserItemProps) => {
  const [ConfirmModal, confirm] = useConfirm(
    'Are you sure?',
    `You are about to remove ${username} from your friend list`
  )
  const deleteMutation = useDeleteFriend()
  const isLoading = deleteMutation.isPending

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const ok = await confirm()

    if (!ok) return

    deleteMutation.mutate(friendId, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success)
        }
      },
    })
  }

  return (
    <>
      <ConfirmModal />
      <Separator className="mx-auto w-[calc(100%-16px)] bg-neutral-700/50" />
      <div className="group relative">
        <Link
          href={`/me/${userId}`}
          className="block h-[60px] w-full cursor-pointer rounded-lg hover:bg-zinc-700/50"
        >
          <div className="flex w-full items-center gap-x-3 p-2 px-4">
            <UserAvatar
              imageUrl={imageUrl}
              name={username}
              status={userStatus}
            />
            <div>
              <div className="line-clamp-1 text-base font-semibold leading-5">
                {username}
              </div>
              <div className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t(userStatus)}
              </div>
            </div>

            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg- ml-auto flex items-center gap-x-1 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-400  opacity-0 transition hover:bg-red-600 hover:text-white disabled:opacity-50 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </Link>
      </div>
    </>
  )
}

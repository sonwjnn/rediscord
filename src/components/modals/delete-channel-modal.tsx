'use client'

import { deleteChannel } from '@/actions/channel'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/store/use-modal-store'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'deleteChannel'
  const { server, channel } = data
  const [isPending, startTransition] = useTransition()

  const onClick = async () => {
    if (!server || !channel) return

    startTransition(() => {
      deleteChannel(server.id, channel.id)
        .then(() => {
          toast.success('Channel deleted!')
          onClose()
          router.push(`/servers/${server.id}`)
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>{' '}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isPending}
              onClick={onClose}
              variant="ghost"
              className="dark: text-white"
            >
              Cancel
            </Button>
            <Button disabled={isPending} variant="primary" onClick={onClick}>
              {isPending ? <Spinner className="mr-2" /> : null}
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { leaveServer } from '@/actions/server'
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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'leaveServer'
  const { server } = data

  const onClick = async () => {
    if (!server) return

    startTransition(() => {
      leaveServer(server?.id)
        .then(() => {
          router.push('/')
          toast.success(`Leaved server successfully`)
          onClose()
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isPending} onClick={onClose} variant="ghost">
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

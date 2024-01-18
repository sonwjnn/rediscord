'use client'

import { newInviteCode } from '@/actions/server'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrigin } from '@/hooks/use-origin'
import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal()

  const [isPending, startTransition] = useTransition()
  const origin = useOrigin()

  const isModalOpen = isOpen && type === 'invite'
  const { server } = data

  const [copied, setCopied] = useState(false)

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onNew = async () => {
    if (!server) return

    startTransition(() => {
      newInviteCode(server.id)
        .then(data => {
          onOpen('invite', { server: data })
        })
        .catch(() => toast.error('Something went wrong'))
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-sm font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isPending}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isPending} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isPending}
            variant="link"
            size="sm"
            className="mt-4 text-xs text-zinc-500"
          >
            Generate a new link
            <RefreshCw
              className={cn('ml-2 size-4', isPending && 'animate-spin')}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

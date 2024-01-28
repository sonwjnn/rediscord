'use client'

import { ModeToggle } from '@/components/mode-toggle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useModal } from '@/store/use-modal-store'

export const SettingsModal = () => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'settings'

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            My settings
          </DialogTitle>
        </DialogHeader>

        <div className=" p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
            Dark mode
          </Label>
          <div className="flex items-center justify-between text-center ">
            <span className="text-[0.8rem] text-zinc-500 dark:text-zinc-300">
              Customize how Jotion looks on your device
            </span>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-1"></div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

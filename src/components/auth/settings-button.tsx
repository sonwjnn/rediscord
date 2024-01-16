'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

import SettingsForm from './settings-form'

interface SettingsButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
  className?: string
}

export const SettingsButton = ({
  children,
  mode = 'redirect',
  asChild,
  className,
}: SettingsButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/settings')
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="min-w-[600px] border-none bg-transparent p-0 ">
          <SettingsForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className={cn('cursor-pointer ', className)}>
      {children}
    </span>
  )
}

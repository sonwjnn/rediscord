'use client'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'

import { ModalProvider } from './modal-provider'
import { QueryProvider } from './query-provider'
import { SocketProvider } from './socket-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="discord-theme"
    >
      <SocketProvider>
        <Toaster/>
        <ModalProvider />
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </SocketProvider>
    </ThemeProvider>
  )
}

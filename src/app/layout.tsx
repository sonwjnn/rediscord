import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/providers/modal-provider'
import { QueryProvider } from '@/providers/query-provider'
// import { SocketProvider } from '@/components/providers/socket-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Open_Sans } from 'next/font/google'

import './globals.css'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rediscord',
  description: 'A Discord clone built with Next.js and Tailwind CSS.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            {/* <SocketProvider> */}
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
            {/* </SocketProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}

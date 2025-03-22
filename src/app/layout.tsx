import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import './globals.css'
import { Providers } from '@/providers'


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
			<html lang='en' suppressHydrationWarning>
				<body
					className={cn('bg-white dark:bg-[#313338] font-gg')}
				>
					<Providers>
						{children}
          </Providers>
				</body>
			</html>
		</SessionProvider>
	)
}

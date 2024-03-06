import authConfig from '@/auth.config'
import { getAccountByUserId } from '@/data/account'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { CleaningDelay, Statuses } from '@prisma/client'
import NextAuth from 'next-auth'

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	unstable_update,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
				},
			})
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== 'credentials') {
				return true
			}

			if (!user?.id) {
				return false
			}

			const existingUser = await getUserById(user.id)

			if (!existingUser?.emailVerified) return false

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation =
					await getTwoFactorConfirmationByUserId(
						existingUser.id,
					)

				if (!twoFactorConfirmation) return false

				// Delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				})
			}
			return true
		},
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub
			}

			if (session.user) {
				session.user.name = token.name
				session.user.isTwoFactorEnabled = token
					.isTwoFactorEnabled as boolean
				session.user.email = token.email as string
				session.user.isOAuth = token.isOAuth as boolean
				session.user.status = token.status as Statuses
				session.user.bio = token.bio as string
				session.user.cleaningDelay = token
					.cleaningDelay as CleaningDelay
				session.user.createdAt = token.createdAt as Date
			}

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserById(token.sub)

			if (!existingUser) return token

			const existingAccount = await getAccountByUserId(existingUser.id)

			token.isOAuth = !!existingAccount
			token.name = existingUser.name
			token.email = existingUser.email
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
			token.status = existingUser.status
			token.bio = existingUser.bio || ''
			token.cleaningDelay = existingUser.cleaningDelay
			token.createdAt = existingUser.createdAt

			return token
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
})

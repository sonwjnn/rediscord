import { JWT } from '@auth/core/jwt'
import { CleaningDelay, Statuses } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
	isTwoFactorEnabled: boolean
	isOAuth: boolean
	status: Statuses
	bio: string
	cleaningDelay: CleaningDelay
	createdAt: Date
}

declare module '@auth/core/types' {
	interface Session {
		user: ExtendedUser
	}
}

declare module '@auth/core/jwt' {
	interface JWT extends ExtendedUser {}
}

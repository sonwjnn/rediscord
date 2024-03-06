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

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends ExtendedUser {}
}

import { CleaningDelay, Statuses } from '@prisma/client'

type User = {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  password: string | null
  image: string | null
  bio: string | null
  isTwoFactorEnabled: boolean
  status: Statuses
  cleaningDelay: CleaningDelay
  createdAt: Date
  updatedAt: Date
}

export type UserConversationResponse = {
  id: string
  userOneId: string
  userTwoId: string
  userOne: User
  userTwo: User
}

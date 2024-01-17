import { auth } from '@/auth'

import { db } from './db'

export const currentUser = async () => {
  const session = await auth()
  return session?.user
}

export const currentProfile = async () => {
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile
}

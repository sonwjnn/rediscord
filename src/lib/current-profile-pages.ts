import { auth } from '@/auth'
import { NextApiRequest } from 'next'

import { db } from './db'

export const currentProfilePages = async (req: NextApiRequest) => {
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

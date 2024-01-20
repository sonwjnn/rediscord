import { db } from '@/lib/db'
import { NextApiRequest } from 'next'

export const currentProfilePages = async (req: NextApiRequest) => {
  // const { userId } = getAuth(req);
  const userId = '123'

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

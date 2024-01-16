import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

import { currentUser } from './auth'

export const initialProfile = async () => {
  const user = await currentUser()

  if (!user) return redirect('/auth/login')

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) {
    return profile
  }

  const nameParts = user.name?.split(' ')
  const firstName = nameParts?.shift()
  const lastName = nameParts?.join(' ')

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${firstName} ${lastName}`,
      image: user.image || '',
      email: user.email || '',
    },
  })

  return newProfile
}

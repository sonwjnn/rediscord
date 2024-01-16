import { db } from '@/lib/db'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({
    where: { userId },
  })
  return twoFactorConfirmation
}

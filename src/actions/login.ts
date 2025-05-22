'use server'

import { signIn } from '@/auth'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schemas'
import { AuthError } from 'next-auth'
import * as z from 'zod'

const handleSuccess = (
  message: string,
  twoFactor: boolean = false,
  canLogin: boolean = false
) => {
  return { success: message, twoFactor, canLogin }
}

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return handleSuccess('Invalid fields!')
  }

  const { email, password, code } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email) {
    return handleSuccess('Email does not exist!')
  }

  if (!existingUser.password) {
    return handleSuccess('Is provider account')
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return handleSuccess('Confirmation email sent!')
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return handleSuccess('Invalid code!')
      }

      if (twoFactorToken.token !== code) {
        return handleSuccess('Invalid code!')
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return handleSuccess('Code expired!')
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)

      return handleSuccess('Two factor code sent!', true)
    }
  }

  return handleSuccess('Login successful!', false, true)
}

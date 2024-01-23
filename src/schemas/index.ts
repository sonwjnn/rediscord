import { ChannelType } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Minimun 6 characters required' }),
  name: z
    .string()
    .min(1, { message: 'User name is required' })
    .refine(name => !name.includes(' '), {
      message: 'User name cannot contain spaces',
    }),
})

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Minimum 6 characters is required' }),
})

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    data => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    data => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  )

export const ServerSchema = z.object({
  name: z.string().min(1, { message: 'Server name is required' }),
  image: z.string().min(1, { message: 'Server image is required' }),
})

export const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine(name => name !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
})

export const ChatItemSchema = z.object({
  content: z.string().min(1),
})

export const MessageFileSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is required.',
  }),
})

import { db } from '@/lib/db'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    })
    return user
  } catch (error) {
    return null
  }
}

export const getUserByUsername = async (name: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        name,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

export const getOtherUserByUsername = async (userId: string, name: string) => {
  try {

    const user = await db.user.findFirst({
      where: {
        name,
        NOT: {
          id: userId
        }
      },
    })

    return user
  } catch (error) {
    console.log(error)
    return null
  }
}
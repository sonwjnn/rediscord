import { db } from '@/lib/db'

export const getChannelById = async (id: string) => {
  try {
    const channel = await db.channel.findUnique({
      where: {
        id,
      },
    })
    return channel
  } catch (error) {
    return null
  }
}

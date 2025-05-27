import { Server } from '@prisma/client'
import { useParams } from 'next/navigation'

export const useServerId = () => {
  const params = useParams()

  return params?.serverId as Server['id']
}

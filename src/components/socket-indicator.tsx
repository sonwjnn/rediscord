'use client'

import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/providers/socket-provider'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="line-clamp-1 border-none bg-yellow-600 text-white"
      >
        Fallback: Polling every 1s
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="line-clamp-1 border-none bg-emerald-600 text-white"
    >
      Live: Real-time updates
    </Badge>
  )
}

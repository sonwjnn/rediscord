import { NextApiResponseServerIo } from '@/types'
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
      transports: ['websocket', 'polling'],

      pingTimeout: 60000, // 60 seconds
      pingInterval: 25000, // 25 seconds
      upgradeTimeout: 30000, // 30 seconds
      maxHttpBufferSize: 1e6, // 1MB

      allowEIO3: true,

      perMessageDeflate: {
        threshold: 2048, // Only compress data if message is larger than this value (in bytes)
      },

      // Set websocket settings
      wsEngine: 'ws',

      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
      },
    })
    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler

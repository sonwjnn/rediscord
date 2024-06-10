import { DirectMessage, Member, Server, User } from '@prisma/client'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type MemberWithUser = Member & { user: User }

export type ServerWithMembersWithUsers = Server & {
  members: MemberWithUser[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type VoiceStatus = {
  mute?: boolean
  deaf?: boolean
  serverMuted?: boolean
}

export type DirectMessageWithMemberWithUser = {
  dm: DirectMessage & { member: MemberWithUser }
}

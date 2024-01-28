'use client'

import { CreateChannelModal } from '@/components/modals/create-channel-modal'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { DeleteChannelModal } from '@/components/modals/delete-channel-modal'
import { DeleteMessageModal } from '@/components/modals/delete-message-modal'
import { DeleteServerModal } from '@/components/modals/delete-server-modal'
import { EditChannelModal } from '@/components/modals/edit-channel-modal'
import { EditServerModal } from '@/components/modals/edit-server-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { LeaveServerModal } from '@/components/modals/leave-server-modal'
import { MembersModal } from '@/components/modals/members-modal'
import { MessageFileModal } from '@/components/modals/message-file-modal'
import { SettingsModal } from '@/components/modals/settings-modal'
import { useIsClient } from 'usehooks-ts'

export const ModalProvider = () => {
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return (
    <>
      <CreateChannelModal />
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
      <SettingsModal />
    </>
  )
}

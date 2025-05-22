import { ChatMessagesSkeleton } from '@/components/chat/chat-channel-messages'
import { ChatHeaderSkeleton } from '@/components/chat/chat-header'
import { ChatInputSkeleton } from '@/components/chat/chat-input'

export const UserIdLoading = () => {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeaderSkeleton type="conversation" />

      <ChatMessagesSkeleton />
      <ChatInputSkeleton />
    </div>
  )
}

import { ChatHeaderSkeleton } from '@/components/chat/chat-header'
import { ChatInputSkeleton } from '@/components/chat/chat-input'
import { ChatMessagesSkeleton } from '@/components/chat/chat-channel-messages'
import { MediaRoomSkeleton } from '@/components/media-room'

const ChannelIdLoadingPage = () => {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeaderSkeleton type="channel" />

      <ChatMessagesSkeleton />
      <ChatInputSkeleton />
    </div>
  )
}

export default ChannelIdLoadingPage

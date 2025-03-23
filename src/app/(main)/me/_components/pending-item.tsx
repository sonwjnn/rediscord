import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { 
  useAcceptFriendRequest, 
  useCancelFriendRequest, 
  useRejectFriendRequest 
} from "@/features/friends/hooks/use-friend-actions";
import { t } from "@/lib/i18n";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

type PendingItemProps = {
  username: string
  friendId: string
  imageUrl: string
  userStatus: any
  type: 'incoming' | 'outgoing'
}

export const PendingItem = ({
  friendId,
  username,
  imageUrl,
  userStatus,
  type,
}: PendingItemProps) => {
  // Using React Query mutations instead of server actions
  const acceptMutation = useAcceptFriendRequest();
  const rejectMutation = useRejectFriendRequest();
  const cancelMutation = useCancelFriendRequest();

  // Check if any action is in progress
  const isLoading = 
    acceptMutation.isPending || 
    rejectMutation.isPending || 
    cancelMutation.isPending;

  const onAccept = () => {
    acceptMutation.mutate(friendId, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success);
        }
      }
    });
  };

  const onReject = () => {
    rejectMutation.mutate(friendId, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success);
        }
      }
    });
  };

  const onCancel = () => {
    cancelMutation.mutate(friendId, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success);
        }
      }
    });
  };

  return (
    <>
      <Separator className="mx-auto w-[calc(100%-16px)] bg-neutral-700/50" />
      <div className="h-[60px] w-full cursor-pointer rounded-lg hover:bg-zinc-700/50">
        <div className="flex items-center w-full gap-x-3 p-2 px-4">
          <UserAvatar imageUrl={imageUrl} name={username} status={userStatus} />
          <div>
            <div className="line-clamp-1 text-base font-semibold leading-5">
              {username}
            </div>
            <div className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t(userStatus)}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-x-2">
            {type === 'incoming' && (
              <>
                <button 
                  onClick={onAccept} 
                  disabled={isLoading}
                  className="flex items-center bg-green-700 hover:bg-green-600 text-white p-2 rounded-full text-sm font-medium transition disabled:opacity-50"
                >
                  <Check className="size-5 " />
                </button>
                <button 
                  onClick={onReject} 
                  disabled={isLoading}
                  className="flex items-center hover:bg-rose-600 text-white p-2 rounded-full text-sm font-medium transition disabled:opacity-50"
                >
                  <X className="size-5 " />
                </button>
              </>
            )}
            {type === 'outgoing' && (
              <button 
                onClick={onCancel} 
                disabled={isLoading}
                className="flex items-center gap-x-1 bg-neutral-700/50 hover:bg-zinc-600 text-zinc-400 hover:text-white p-2 rounded-full text-sm font-medium transition disabled:opacity-50"
              >
                <X className="size-5 " />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
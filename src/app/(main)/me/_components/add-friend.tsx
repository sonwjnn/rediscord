"use client"

import { useState } from "react";
import { useSendFriendRequest } from "@/features/friends/hooks/use-friend-actions";
import { toast } from "sonner";

const AddFriend = () => {
  const [username, setUsername] = useState("");
  const sendFriendMutation = useSendFriendRequest();
  
  const onSendFriendReq = () => {
    if (!username.trim()) {
      return toast.error("Please enter a username");
    }
    
    sendFriendMutation.mutate(username, {
      onSuccess: ({ success }) => {
        if (success) {
          toast.success(success);
          setUsername(""); // Clear input after successful send
        }
      }
    });
  }

  return (
    <div className="flex flex-col px-6 mt-6">
      <h1 className="text-base font-semibold text-zinc-600 dark:text-white">ADD FRIEND</h1>
      <p className="text-base font-medium text-zinc-500 dark:text-zinc-400 my-2">You can add friends with their Discord username.</p>
      <form 
        className="flex mb-4 h-12 relative"
        onSubmit={(e) => {
          e.preventDefault();
          onSendFriendReq();
        }}
      >
        <input
          type="text"
          placeholder="You can add friends with their Discord username."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 p-2 px-4 rounded-lg focus-visible:border-0 focus-visible:ring-offset-0 border-0 focus-visible:ring-transparent focus-visible:outline-none bg-zinc-100 text-zinc-500 dark:bg-[#1e1f22] dark:text-neutral-300"
        />
        <button 
          type="submit"
          disabled={sendFriendMutation.isPending || !username.trim()} 
          className="text-sm font-medium text-white bg-indigo-500 px-4 py-1.5 absolute right-3 top-1/2 -translate-y-1/2 rounded-sm disabled:opacity-50"
        >
          Send friend request
        </button>
      </form>
    </div>
  );
};

export default AddFriend;
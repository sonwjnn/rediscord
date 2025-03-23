import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Response type for friend actions
interface FriendActionResponse {
  success?: string;
  error?: string;
  friend?: any;
  request?: any;
}

// Send friend request hook
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string): Promise<FriendActionResponse> => {
      const response = await fetch("/api/friends/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send friend request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate pending requests query to show the new outgoing request
      queryClient.invalidateQueries({ queryKey: ["pending-req"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Accept friend request hook
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string): Promise<FriendActionResponse> => {
      const response = await fetch(`/api/friends/accept/${friendId}`, {
        method: "PATCH",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to accept friend request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["pending-req"] });
      queryClient.invalidateQueries({ queryKey: ["friends-all"] });
      queryClient.invalidateQueries({ queryKey: ["friends-online"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Reject friend request hook
export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string): Promise<FriendActionResponse> => {
      const response = await fetch(`/api/friends/reject/${friendId}`, {
        method: "PATCH",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to reject friend request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Only invalidate pending requests since this doesn't affect other lists
      queryClient.invalidateQueries({ queryKey: ["pending-req"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Cancel friend request hook
export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string): Promise<FriendActionResponse> => {
      const response = await fetch(`/api/friends/cancel/${friendId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to cancel friend request");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Only invalidate pending requests
      queryClient.invalidateQueries({ queryKey: ["pending-req"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Delete friend hook
export const useDeleteFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string): Promise<FriendActionResponse> => {
      const response = await fetch(`/api/friends/delete/${friendId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete friend");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all related friend queries
      queryClient.invalidateQueries({ queryKey: ["friends-all"] });
      queryClient.invalidateQueries({ queryKey: ["friends-online"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}; 
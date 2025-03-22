"use client"

import { useState, useEffect } from "react";
import { Statuses} from "@prisma/client";
import { useDebounceValue } from "usehooks-ts";
import { UserAvatar } from "@/components/user-avatar";
import { LoaderIcon } from "lucide-react";

type AddFriendProps = {
  userId: string
}

const AddFriend = ({userId}: AddFriendProps) => {
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounceValue(username, 500);
  const [user, setUser] = useState<{
    userId: string
    name: string | null
    image: string | null
    status: Statuses | null
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (debouncedUsername.trim()) {
      handleSearch();
    } else {
      setUser(null);
    }
  }, [debouncedUsername]);

  const handleSearch = async () => {
    if (!debouncedUsername.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setUser(null)
      
      const response = await fetch(`/api/users/search?username=${encodeURIComponent(debouncedUsername)}&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const data = await response.json();
      
      if(data) {
        setUser(
          {
            userId: data.id,
            name: data.name,
            image: data.image,
            status: data.status || null,
          }
        );
      } else {
        setUser(null);
      }
    } catch (error) {
      setError("Failed to find users");
      console.error(error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-6 mt-6">
      <h1 className="text-base font-semibold text-white">ADD FRIEND</h1>
      <p className="text-base font-medium text-zinc-400 my-2">You can add friends with their Discord username.</p>
      <div className="flex mb-4 h-12 relative">
        <input
          type="text"
          placeholder="You can add friends with their Discord username."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 p-2 px-4 rounded-lg focus-visible:border-0 focus-visible:ring-offset-0 border-0 focus-visible:ring-transparent focus-visible:outline-none bg-[#1e1f22] text-neutral-300"
        />
        <button className="text-sm font-medium text-white bg-indigo-500 px-4 py-1.5 absolute right-3 top-1/2 -translate-y-1/2 rounded-sm disabled:opacity-50">Send friend request</button>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-[300px] w-full">
          <LoaderIcon className="h-6 w-6 animate-spin"/>
        </div>
      )}
      {!user && !isLoading && (
        <div>No data</div>
      )}
      {user && (
        <div className="cursor-pointer h-[60px] w-full hover:bg-zinc-700/50 rounded-lg">
        <div className="w-full p-2 px-4 flex gap-x-3">
          <UserAvatar imageUrl={user.image || ''} name={user.name || "user"} status={undefined} />
          <div className="flex items-center">
            <div className="line-clamp-1 text-base font-semibold leading-5">{user.name}</div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AddFriend;
"use client"

import { useGetAllFriends } from "@/features/friends/hooks/use-get-all-friends";
import { Section } from "./section";
import { UserItem } from "./user-item";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

type AllFriendsProps = {
  userId: string
}

const AllFriends = ({userId}: AllFriendsProps) => {
  const { data: friends, isLoading } = useGetAllFriends(userId);
  const [searchQuery, setSearchQuery] = useState("");

  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full">
        <LoaderIcon className="h-6 w-6 animate-spin"/>
      </div>
    )
  }

  if(!friends || friends.length === 0) {
    return (
      <div className="h-[80vh] w-full">
        No data
      </div>
    )
  }

  const filteredFriends = friends.filter((friend) => 
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <div className="flex mb-4 h-10">
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 px-3 rounded-md focus-visible:border-0 focus-visible:ring-offset-0 border-0 focus-visible:ring-transparent focus-visible:outline-none bg-[#1e1f22] text-neutral-300"
        />
      </div>

      <Section label={`all - ${filteredFriends.length}`}/>

      {filteredFriends.map(item => (
        <UserItem
          key={item.userId}
          username={item.name || ''}
          userStatus={item.status}
          imageUrl={item.image || ''}
        />
      ))}
    </div>
  );
};

export default AllFriends;
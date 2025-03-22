"use client"

import { LoaderIcon } from "lucide-react";
import { useGetOnlineFriends } from "@/features/friends/hooks/use-get-online-friends";
import { Section } from "./section";
import { UserItem } from "./user-item";

type OnlineFriendsProps = {
  userId: string
}

const OnlineFriends = async ({userId}: OnlineFriendsProps) => {
  const { data: friends, isLoading } = useGetOnlineFriends(userId);

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

  return (
    <div className="flex flex-col">
      <Section label={`online - ${friends.length}`}/>

      {friends.map(item => (
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

export default OnlineFriends;
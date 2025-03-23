"use client"

import { LoaderIcon } from "lucide-react";
import { PendingList } from "./pending-list";
import { useGetPendingReq } from "@/features/friends/hooks/use-get-pending-req";

const PendingFriends = () => {
  const { data: friends, isLoading } = useGetPendingReq();

  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full">
        <LoaderIcon className="h-6 w-6 animate-spin"/>
      </div>
    )
  }


  return (
    <div className="flex flex-col p-6">
      <PendingList 
        incoming={friends?.incoming ?? []}
        outgoing={friends?.outgoing ?? []}
      />
    </div>
  );
};

export default PendingFriends;
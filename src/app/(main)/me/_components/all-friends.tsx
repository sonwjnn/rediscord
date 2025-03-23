"use client"

import { useGetAllFriends } from "@/features/friends/hooks/use-get-all-friends";
import { Section } from "./section";
import { UserItem } from "./user-item";
import { LoaderIcon, Search } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

const AllFriends = () => {
  const { data: friends, isLoading } = useGetAllFriends();
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc bạn bè theo từ khóa tìm kiếm
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    if (!searchQuery.trim()) return friends;
    
    return friends.filter((friend) => 
      friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] w-full">
        <LoaderIcon className="h-6 w-6 animate-spin"/>
      </div>
    )
  }

  if(!friends || friends.length === 0) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-200 mb-1">No Friends Added Yet</h3>
        <p className="text-sm text-zinc-500 mb-4">Get started by adding some friends to your list</p>
        <Link 
          href="/me?tabs=ADD_FRIEND"
          className="text-sm font-medium text-white bg-indigo-500 px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Add Friends
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6">
      <div className="flex mb-4 h-10 relative">
        <div className="absolute inset-y-0 right-4 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search friends"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-3 pr-4 py-2 rounded-md bg-[#1e1f22] text-neutral-300 focus-visible:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200"
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>

      <Section label={`all - ${filteredFriends.length}`}/>

      {filteredFriends.length > 0 ? (
        filteredFriends.map(item => (
          <UserItem
            key={item.userId}
            userId={item.userId}
            username={item.name || ''}
            userStatus={item.status}
            imageUrl={item.image || ''}
            friendId={item.id || ''}
          />
        ))
      ) : (
        <div className="text-zinc-400 text-center py-6">
          No results found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
};

export default AllFriends;
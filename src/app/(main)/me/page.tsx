import { Suspense } from "react";
import Header from "./_components/header";
import OnlineFriends from "./_components/online-friends";
import AllFriends from "./_components/all-friends";
import PendingFriends from "./_components/pending-friends";
import AddFriend from "./_components/add-friend";
import { TabsType } from "./types";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const FriendLayout = async ({
  searchParams,
}: {
  searchParams: { tabs?: string };
}) => {
  const tab = (searchParams?.tabs || "ONLINE") as TabsType

  const user = await currentUser()

  if(!user || !user.id) {
    return redirect('/auth/login')
  }
  
  const renderContent = () => {
    if(!user || !user.id) return

    switch (tab) {
      case "ONLINE":
        return <OnlineFriends userId={user.id}/>;
      case "ALL":
        return <AllFriends userId={user.id}/>;
      case "PENDING":
        return <PendingFriends userId={user.id}/>;
      case "ADD_FRIEND":
        return <AddFriend userId={user.id}/>;
      default:
        return <OnlineFriends userId={user.id}/>;
    }
  };

  return (
    <div className="flex flex-col">
      <Header />
      {renderContent()}
    </div>
  );
};

// Wrap with Suspense to handle any async operations
export default function Page(props: { searchParams: { tabs?: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FriendLayout searchParams={props.searchParams} />
    </Suspense>
  );
}
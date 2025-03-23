import { Suspense } from "react";
import Header from "./_components/header";
import OnlineFriends from "./_components/online-friends";
import AllFriends from "./_components/all-friends";
import PendingFriends from "./_components/pending-friends";
import AddFriend from "./_components/add-friend";
import { TabsType } from "./types";

const FriendLayout = async ({
  searchParams,
}: {
  searchParams: { tabs?: string };
}) => {
  const tab = ((await searchParams)?.tabs || "ONLINE") as TabsType
  
  const renderContent = () => {
    switch (tab) {
      case "ONLINE":
        return <OnlineFriends />;
      case "ALL":
        return <AllFriends />;
      case "PENDING":
        return <PendingFriends />;
      case "ADD_FRIEND":
        return <AddFriend />;
      default:
        return <OnlineFriends />;
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
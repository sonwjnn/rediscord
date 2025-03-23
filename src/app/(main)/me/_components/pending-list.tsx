import { Statuses } from "@prisma/client";
import { PendingItem } from "./pending-item";
import { Section } from "./section";


type PendingListProps = {
    incoming: {
      id?: string
      userId: string
      name: string | null
      image: string | null
      status?: Statuses | null
    }[],
    outgoing: {
      id?: string
      userId: string
      name: string | null
      image: string | null
      status?: Statuses | null
    }[]
}

export const PendingList = ({ incoming, outgoing }: PendingListProps) => {

  if ((!incoming || incoming.length === 0) && (!outgoing || outgoing.length === 0)) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-200 mb-1">No pending requests</h3>
        <p className="text-sm text-gray-500">You don&apos;t have any incoming or outgoing friend requests at the moment</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Section label={`pending - ${incoming.length + outgoing.length}`} />

      {incoming.map(item => (
        <PendingItem
          key={item.userId}
          friendId={item.id!}
          username={item.name || ''}
          userStatus={null}
          imageUrl={item.image || ''}
          type="incoming"
        />
      ))}

      {outgoing.map(item => (
        <PendingItem
          key={item.userId}
          friendId={item.id!}
          username={item.name || ''}
          userStatus={null}
          imageUrl={item.image || ''}
          type="outgoing"
        />
      ))}
    </div>
  )
}
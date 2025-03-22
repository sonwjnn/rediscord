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
    return <div className="h-[80vh] w-full">No data</div>
  }

  return (
    <div className="flex flex-col">
      <Section label={`pending - ${incoming.length + outgoing.length}`} />

      {incoming.map(item => (
        <PendingItem
          key={item.userId}
          username={item.name || ''}
          userStatus={Statuses.ONLINE}
          imageUrl={item.image || ''}
          type="incoming"
        />
      ))}

      {outgoing.map(item => (
        <PendingItem
          key={item.userId}
          username={item.name || ''}
          userStatus={Statuses.ONLINE}
          imageUrl={item.image || ''}
          type="outgoing"
        />
      ))}
    </div>
  )
}
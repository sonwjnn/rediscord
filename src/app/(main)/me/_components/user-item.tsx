import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { t } from "@/lib/i18n";


type UserItemProps = {
  username: string
  imageUrl:string
  userStatus: any

}

export const UserItem = ({ username, imageUrl, userStatus }: UserItemProps) => {
  return (
   <>
    <Separator className="bg-neutral-700/50 w-[calc(100%-16px)] mx-auto"/>
     <div className="cursor-pointer h-[60px] w-full hover:bg-zinc-700/50 rounded-lg">
      <div className="w-full p-2 px-4 flex gap-x-3">
        <UserAvatar imageUrl={imageUrl} name={username} status={userStatus} />
        <div>
          <div className="line-clamp-1 text-base font-semibold leading-5">{username}</div>
          <div className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t(userStatus)}
          </div>
        </div>
      </div>
    </div>
   </>
  )
}

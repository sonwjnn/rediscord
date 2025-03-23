"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaUserFriends } from "react-icons/fa";


type HeaderProps = {}

const Header = ({}: HeaderProps) => {
  const searchParams = useSearchParams()
  const tab = searchParams?.get('tabs') || 'ONLINE'

  const tabs = [
    {
      label: 'Online',
      href: '/me?tabs=ONLINE',
    },
    {
      label: 'All',
      href: '/me?tabs=ALL',
    },
    {
      label: 'Pending',
      href: '/me?tabs=PENDING',
    },
  ]

  return (
    <div className="flex h-12 items-center p-2 border border-b-zinc-200 dark:border-b-neutral-800">
      <div className="flex h-6 items-center gap-x-3">
        <div className="flex gap-x-1 text-base font-semibold">
          <FaUserFriends className="mx-2 size-6 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
          <p className="text-zinc-600 dark:text-zinc-300">Friends</p>
        </div>
        <Separator orientation="vertical" className="bg-zinc-300 dark:bg-neutral-600"/>
        <div className="flex h-6 items-center gap-x-3">
          {tabs.map(item => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'h-7 px-2 py-0.5 text-base leading-5 font-medium',
                  `/me?tabs=${tab}` === item.href &&
                    ' bg-zinc-700/10 text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300'
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <Link href="/me?tabs=ADD_FRIEND">
              <Button
                variant="green"
                className={cn(
                  'h-7 px-2 py-0.5 text-base leading-5',
                )}
              >
                Add friend
              </Button>
            </Link>
      </div>
    </div>
  )
}

export default Header;
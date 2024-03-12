import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getSeversByuserId } from '@/data/server'
import { currentUser } from '@/lib/auth'
import { MOCK_SERVERS } from '@/lib/mock'
import { redirect } from 'next/navigation'

import { Actions } from './actions'
import { Item, ItemSkeleton } from './item'
import { Wrapper } from './wrapper'

export const Navbar = async () => {
	const user = await currentUser()

	if (!user) {
		return redirect('/')
	}
	const servers = await getSeversByuserId(user.id as string)

	if (!servers) {
		return <NavbarSkeleton />
	}

	return (
		<Wrapper>
			<Actions />
			<Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
			<ScrollArea className='w-full flex-1'>
				{servers.map((server) => (
					<div key={server.id} className='mb-4'>
						<Item
							id={server.id}
							initialChannelId={server?.channels[0]?.id}
							name={server.name}
							imageUrl={server.image}
						/>
					</div>
				))}
			</ScrollArea>
		</Wrapper>
	)
}

export const NavbarSkeleton = () => {
	return (
		<ul className='space-y-4 px-2 lg:pt-0'>
			<ItemSkeleton />
			<Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
			{[...Array(MOCK_SERVERS)].map((_, i) => <ItemSkeleton key={i} />)}
		</ul>
	)
}

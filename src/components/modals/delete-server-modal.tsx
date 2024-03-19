'use client'

import { deleteServer } from '@/actions/server'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/store/use-modal-store'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export const DeleteServerModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const [isPending, startTrantition] = useTransition()
	const router = useRouter()

	const isModalOpen = isOpen && type === 'deleteServer'
	const { server } = data

	if (!server) return
	const oldServerImage = server.image

	const onClick = async () => {
		startTrantition(() => {
			deleteServer(server?.id)
				.then(() => {
					router.push('/')
					toast.success(`Deleted server successfully`)
					onClose()
				})
				.then(async () => {
					await axios.delete('/api/uploadthing', {
						data: {
							url: oldServerImage,
						},
					})
				})
				.catch(() => toast.error('Something went wrong'))
		})
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className='overflow-hidden bg-white p-0 text-black'>
				<DialogHeader className='px-6 pt-8'>
					<DialogTitle className='text-center text-2xl font-bold'>
						Delete Server
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Are you sure you want to do this? <br />
						<span className='font-semibold text-indigo-500'>
							{server?.name}
						</span>{' '}
						will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='bg-gray-100 px-6 py-4'>
					<div className='flex w-full items-center justify-between'>
						<Button
							disabled={isPending}
							onClick={onClose}
							variant='ghost'
						>
							Cancel
						</Button>
						<Button
							disabled={isPending}
							variant='primary'
							onClick={onClick}
						>
							{isPending ? <Spinner className='mr-2' /> : null}
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

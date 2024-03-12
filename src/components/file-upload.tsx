'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

interface FileUploadProps {
	onChange: (url?: string) => void
	value: string
	endpoint: 'messageFile' | 'serverImage' | 'userImage'
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
	const fileType = value?.split('.').pop()

	if (value && fileType !== 'pdf') {
		return (
			<div className='relative h-20 w-20'>
				<Image
					fill
					sizes='100%'
					src={value}
					alt='Upload'
					className='rounded-full'
				/>
				<button
					onClick={() => onChange('')}
					className='absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm'
					type='button'
				>
					<X className='size-4' />
				</button>
			</div>
		)
	}

	if (value && fileType === 'pdf') {
		return (
			<div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
				<FileIcon className='size-10 fill-indigo-200 stroke-indigo-400' />
				<a
					href={value}
					target='_blank'
					rel='noopener noreferrer'
					className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
				>
					{value}
				</a>
				<button
					onClick={() => onChange('')}
					className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
					type='button'
				>
					<X className='size-4' />
				</button>
			</div>
		)
	}

	return (
		<div className='rounded-lg dark:bg-zinc-300'>
			<UploadDropzone
				endpoint={endpoint}
				onClientUploadComplete={(res) => {
					onChange(res?.[0].url)
				}}
				onUploadError={(error: Error) => {
					console.log(error)
				}}
			/>
		</div>
	)
}

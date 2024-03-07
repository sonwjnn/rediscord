import { getSelf } from '@/data/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const handleAuth = async () => {
	const self = await getSelf()
	if (!self) throw new Error('Unauthorized')

	return { userId: self.id }
}

export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	userImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	messageFile: f(['image', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

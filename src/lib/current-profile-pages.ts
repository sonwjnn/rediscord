import { auth } from '@/auth'
import { NextApiRequest } from 'next'

import { db } from './db'
import { NextApiResponseServerIo } from '@/types'

export const currentUserPages = async (
	req: NextApiRequest,
	res: NextApiResponseServerIo,
) => {
	const session = await auth(req, res)
	const userId = session?.user?.id
	if (!userId) {
		return null
	}
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
	})
	return user
}

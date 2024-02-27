import { Statuses } from '@prisma/client'

export const t = (status: string | undefined) => {
	try {
		if (!status) return null

		switch (status) {
			case Statuses.ONLINE:
				return 'Online'
			case Statuses.IDLE:
				return 'Idle'
			case Statuses.DND:
				return "Don't Disturb"
			case Statuses.OFFLINE:
				return 'Offline'
			case Statuses.MOBILE:
				return 'Mobile'
			default:
				return 'Online'
		}
	} catch (error) {
		console.error(error)
		return status
	}
}

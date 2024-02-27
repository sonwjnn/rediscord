import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { BsGearFill, BsHeadphones, BsMicFill } from 'react-icons/bs'

import { Hint } from '../hint'

interface ControlsProps {
	voiceStatus: {
		mute?: boolean
		deaf?: boolean
	}
	setVoiceStatus: (
		statusUpdater: (prev: { mute?: boolean; deaf?: boolean }) => {
			mute?: boolean
			deaf?: boolean
		},
	) => void
}
export const Controls = ({ voiceStatus, setVoiceStatus }: ControlsProps) => {
	const { onOpen } = useModal()

	const toggleMute = () => {
		setVoiceStatus((prev) => {
			if (prev?.deaf) {
				return {
					mute: !prev?.mute,
					deaf: false,
				}
			}

			return {
				...prev,
				mute: !prev?.mute,
			}
		})
	}

	const toggleDeaf = () => {
		setVoiceStatus((prev) => {
			if (!prev?.deaf) {
				return {
					mute: true,
					deaf: true,
				}
			}

			return {
				mute: false,
				deaf: false,
			}
		})
	}

	const muteTooltipText = voiceStatus.mute || voiceStatus.deaf
		? 'Unmute'
		: 'Mute'
	const deafTooltipText = voiceStatus.deaf ? 'Undeaf' : 'Deaf'

	return (
		<div className='flex items-center'>
			<Hint label={muteTooltipText}>
				<button
					onClick={toggleMute}
					className={cn(
						'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-300 dark:hover:bg-white/10',
						'text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 ',
					)}
				>
					<BsMicFill fontSize={18} />
					{voiceStatus.mute && (
						<div className='border-semibackground absolute h-3/4 w-[5px] rotate-45 rounded-sm border-[2px] bg-red-500 group-hover:border-gray-700'>
						</div>
					)}
				</button>
			</Hint>

			<Hint label={deafTooltipText}>
				<button
					onClick={toggleDeaf}
					className={cn(
						'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-300 dark:hover:bg-white/10',
						'text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300',
					)}
				>
					<BsHeadphones fontSize={20} />
					{voiceStatus.deaf && (
						<div className='border-semibackground absolute h-3/4 w-[5px] rotate-45 rounded-sm border-[2px] bg-red-500 group-hover:border-gray-700'>
						</div>
					)}
				</button>
			</Hint>

			<Hint label='Settings'>
				<button
					onClick={() => onOpen('settings')}
					className={cn(
						'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-300 dark:hover:bg-white/10',
						'text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300',
					)}
				>
					<BsGearFill fontSize={18} />
				</button>
			</Hint>
		</div>
	)
}

export const ControlsSkeleton = () => (
	<div className='flex items-center gap-x-2'>
		<Skeleton className='size-6 ' />
		<Skeleton className='size-6 ' />
		<Skeleton className='size-6 ' />
	</div>
)

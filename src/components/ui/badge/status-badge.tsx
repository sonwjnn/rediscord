import { cn } from '@/lib/utils'
import { UserStatuses } from '@/types'
import { Statuses } from '@prisma/client'
import { MdPhoneAndroid } from 'react-icons/md'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: UserStatuses | 'skeleton'
}

export default function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-[3px]',
        status === Statuses.ONLINE && 'bg-green-600',
        status === Statuses.OFFLINE && 'bg-gray-500',
        status === Statuses.DND && 'bg-red-600',
        status === Statuses.IDLE && 'bg-yellow-600',
        status === 'skeleton'
          ? 'border-gray-900 bg-gray-900'
          : 'border-midground',
        status !== Statuses.MOBILE && 'h-[15px] w-[15px]',
        status === Statuses.MOBILE &&
          'bg-midground h-[18px] w-3.5 rounded-sm text-green-600',
        className
      )}
      {...props}
    >
      {status === Statuses.OFFLINE && (
        <div className="bg-midground h-1.5 w-1.5 rounded-full"></div>
      )}
      {status === Statuses.DND && (
        <div className="bg-midground h-0.5 w-1.5 rounded-sm"></div>
      )}
      {status === Statuses.IDLE && (
        <div
          className={`absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-white transition group-hover:bg-[#4752c4]  dark:bg-black`}
        ></div>
      )}
      {status === Statuses.MOBILE && (
        <MdPhoneAndroid fontSize={15} className="flex-none" />
      )}
    </div>
  )
}

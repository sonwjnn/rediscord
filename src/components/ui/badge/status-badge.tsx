import { cn } from '@/lib/utils'
import { StaticUserStatuses, UserStatuses } from '@/types'
import { MdPhoneAndroid } from 'react-icons/md'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: UserStatuses | 'skeleton'
  customBackgroundColor?: string
}

export default function StatusBadge({
  status,
  className,
  customBackgroundColor = 'bg-midground',
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-[3px]',
        status === StaticUserStatuses.Online && 'bg-green-600',
        status === StaticUserStatuses.Offline && 'bg-gray-500',
        status === StaticUserStatuses.DND && 'bg-red-600',
        status === StaticUserStatuses.Idle && 'bg-yellow-600',
        status === 'skeleton'
          ? 'border-gray-900 bg-gray-900'
          : 'border-midground',
        status !== StaticUserStatuses.Mobile && 'h-[15px] w-[15px]',
        status === StaticUserStatuses.Mobile &&
          'bg-midground h-[18px] w-3.5 rounded-sm text-green-600',
        className
      )}
      {...props}
    >
      {status === StaticUserStatuses.Offline && (
        <div className="bg-midground h-1.5 w-1.5 rounded-full"></div>
      )}
      {status === StaticUserStatuses.DND && (
        <div className="bg-midground h-0.5 w-1.5 rounded-sm"></div>
      )}
      {status === StaticUserStatuses.Idle && (
        <div
          className={`absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full ${customBackgroundColor} `}
        ></div>
      )}
      {status === StaticUserStatuses.Mobile && (
        <MdPhoneAndroid fontSize={15} className="flex-none" />
      )}
    </div>
  )
}

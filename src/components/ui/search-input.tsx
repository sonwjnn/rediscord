'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  iconClassName?: string;
}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
  ({ className, containerClassName, iconClassName, type, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "relative flex items-center",
          containerClassName
        )}
      >
        <Search 
          className={cn(
            "absolute left-3 size-4 text-zinc-500 dark:text-zinc-400",
            iconClassName
          )} 
        />
        <Input
          type="search"
          className={cn(
            "pl-9 bg-zinc-100/50 dark:bg-zinc-800/50 border-none focus-visible:ring-primary",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export { SearchInput } 
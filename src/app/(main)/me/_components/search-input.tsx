// 'use client'

// import { SearchInput } from '@/components/ui/search-input'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { useCallback, useEffect, useState } from 'react'

// export const FriendSearchInput = () => {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
  
//   const initialQuery = searchParams.get('q') ?? ''
//   const [value, setValue] = useState(initialQuery)
  
//   // Debounce the search to avoid too many URL updates
//   const handleSearch = useDebouncedCallback((term: string) => {
//     const params = new URLSearchParams(searchParams)
    
//     if (term) {
//       params.set('q', term)
//     } else {
//       params.delete('q')
//     }
    
//     router.replace(`${pathname}?${params.toString()}`)
//   }, 300)
  
//   // Update the search param when the input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value)
//     handleSearch(e.target.value)
//   }
  
//   // Sync the input value with the URL parameter
//   useEffect(() => {
//     setValue(initialQuery)
//   }, [initialQuery])
  
//   return (
//     <SearchInput
//       placeholder="Search for friends"
//       value={value}
//       onChange={handleChange}
//       className="w-full md:w-[300px]"
//     />
//   )
// }

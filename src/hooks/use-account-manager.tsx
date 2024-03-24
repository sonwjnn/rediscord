'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import { ExtendedUser as User } from '../../next-auth'

export const AccountManagerContext = createContext<{
  accounts: User[]
  addAccount: (account: User) => void
}>({ accounts: [], addAccount: v => {} })

export const AccountManagerProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [accounts, setAccounts] = useState<User[]>([
    // Default accounts - just for testing
    {
      name: 'John Done',
      id: '8',
      email: 'john.doe@email.com',
      image: '',
      isTwoFactorEnabled: false,
      isOAuth: false,
      status: 'ONLINE',
      bio: '',
      cleaningDelay: 'ONE_HOUR',
      createdAt: new Date('2024-01-27T13:36:09.266Z'),
    },
    {
      name: 'Doo Done',
      id: '9',
      email: 'doo.doe@email.com',
      image: '',
      isTwoFactorEnabled: false,
      isOAuth: false,
      status: 'ONLINE',
      bio: '',
      cleaningDelay: 'ONE_HOUR',
      createdAt: new Date('2024-01-27T13:36:09.266Z'),
    },
  ])

  return (
    <AccountManagerContext.Provider
      value={{
        accounts,

        // this can be used when a user logs in
        addAccount: account => {
          setAccounts(prev => [...prev, account])
        },
      }}
    >
      {children}
    </AccountManagerContext.Provider>
  )
}

// useAccountManager Hook
export const useAccountManager = () => {
  return useContext(AccountManagerContext)
}

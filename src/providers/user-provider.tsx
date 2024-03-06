'user client'

import { AccountManagerProvider } from '@/hooks/use-account-manager'

interface UserProviderProps {
	children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	return <AccountManagerProvider>{children}</AccountManagerProvider>
}

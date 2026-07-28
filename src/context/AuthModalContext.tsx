import { createContext, useContext } from 'react'

interface AuthModalContextType {
  openLogin: () => void
  openRegister: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({
  value,
  children,
}: {
  value: AuthModalContextType
  children: React.ReactNode
}) {
  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider')
  return context
}
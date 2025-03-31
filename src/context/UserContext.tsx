'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/interfaces/user'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('user_info='))

    if (cookie) {
      try {
        const json = decodeURIComponent(cookie.split('=')[1])
        const parsedUser = JSON.parse(json)
        setUser(parsedUser)
      } catch (err) {
        console.error('Error parsing user_info cookie:', err)
        setUser(null)
      }
    }
  }, [])

  const logout = () => {
    setUser(null)

    // Clear both cookies
    document.cookie = 'user_info=; Max-Age=0; path=/'
    document.cookie = 'session=; Max-Age=0; path=/' // optional if you handle it on server too
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
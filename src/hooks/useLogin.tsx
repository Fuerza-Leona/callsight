'use client'

import { useState } from 'react'
import axios from 'axios'
import { apiURL } from '@/app/constants'
import type { User } from '@/interfaces/user'
import { useUser } from '@/context/UserContext' // Import useUser

const API_URL = `${apiURL}/auth/login`

interface LoginSuccessResponse {
  access_token: string
  refresh_token: string
  user: User
}

/*interface LoginErrorResponse {
  detail: string
}*/

export const useLogin = () => {
  const [data, setData] = useState<LoginSuccessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { setUser, setToken } = useUser() // Access context setter

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post<LoginSuccessResponse>(API_URL, {
        email,
        password,
      })

      setData(response.data)
      setUser(response.data.user) // Update context
      console.log("setting token")
      setToken(response.data.access_token)
      console.log("saved token")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.detail || 'Login failed. Please try again.'
        setError(message)
      } else {
        setError('An unexpected error occurred.')
      }
      setData(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return { login, data, loading, error }
}
import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import AuthContext from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!localStorage.getItem('nutriai_token')) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch {
        localStorage.removeItem('nutriai_token')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  function completeAuthentication(data) {
    localStorage.setItem('nutriai_token', data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('nutriai_token')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, completeAuthentication, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

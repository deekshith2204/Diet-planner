import { useEffect, useState } from 'react'
import api from '../api/client'

export default function useHealthProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await api.get('/health-profile/me')
        setProfile(data.profile)
        setMissing(false)
      } catch (error) {
        if (error.response?.status === 404) {
          setMissing(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  return { profile, loading, missing, setProfile, setMissing }
}

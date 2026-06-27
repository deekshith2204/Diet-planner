import { useEffect, useState } from 'react'
import api from '../api/client'

export default function useDashboardSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSummary() {
      try {
        const { data } = await api.get('/dashboard/summary')
        setSummary(data)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  return { summary, loading }
}

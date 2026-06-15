import { useEffect, useState } from 'react'
import api from '../api/client'

export default function useMealPlan() {
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    async function loadMealPlan() {
      try {
        const { data } = await api.get('/meal-plans/today')
        setMealPlan(data.mealPlan)
        setMissing(false)
      } catch (error) {
        if (error.response?.status === 404) {
          setMissing(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadMealPlan()
  }, [])

  return { mealPlan, loading, missing, setMealPlan, setMissing }
}

import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../api/client'
import FormField from '../components/FormField'
import SelectField from '../components/SelectField'
import getApiErrorMessage from '../utils/getApiErrorMessage'

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  foodItem: '',
  calories: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  mealType: 'breakfast',
  notes: '',
}

function FoodLogPage() {
  const [form, setForm] = useState(initialForm)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  async function refreshLogs() {
    setLoading(true)
    try {
      const { data } = await api.get('/food-logs')
      setLogs(data.logs)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not load food logs'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      try {
        const { data } = await api.get('/food-logs')
        setLogs(data.logs)
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Could not load food logs'))
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.post('/food-logs', {
        ...form,
        calories: Number(form.calories),
        proteinG: Number(form.proteinG || 0),
        carbsG: Number(form.carbsG || 0),
        fatG: Number(form.fatG || 0),
      })
      toast.success('Food logged')
      setForm(initialForm)
      refreshLogs()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not log food'))
    }
  }

  async function deleteLog(id) {
    try {
      await api.delete(`/food-logs/${id}`)
      setLogs((current) => current.filter((log) => log.id !== id))
      toast.success('Food log deleted')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not delete food log'))
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">FOOD DIARY</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Log what you ate</h1>
          <p className="mt-3 text-slate-600">Track actual intake against your generated meal plan.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Date" name="date" type="date" value={form.date} onChange={updateField} required />
            <SelectField label="Meal type" name="mealType" value={form.mealType} onChange={updateField}>
              <option value="breakfast">Breakfast</option>
              <option value="snack_1">Snack 1</option>
              <option value="lunch">Lunch</option>
              <option value="snack_2">Snack 2</option>
              <option value="dinner">Dinner</option>
              <option value="other">Other</option>
            </SelectField>
            <FormField label="Food item" name="foodItem" value={form.foodItem} onChange={updateField} required />
            <div className="grid gap-3 sm:grid-cols-4">
              <FormField label="Calories" name="calories" type="number" min="0" value={form.calories} onChange={updateField} required />
              <FormField label="Protein g" name="proteinG" type="number" min="0" value={form.proteinG} onChange={updateField} />
              <FormField label="Carbs g" name="carbsG" type="number" min="0" value={form.carbsG} onChange={updateField} />
              <FormField label="Fat g" name="fatG" type="number" min="0" value={form.fatG} onChange={updateField} />
            </div>
            <FormField label="Notes" name="notes" value={form.notes} onChange={updateField} placeholder="e.g. spicy, takeaway, symptoms" />
            <button className="rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">Add food</button>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-950">Recent logs</h2>
            <Link to="/dashboard" className="text-sm font-semibold text-emerald-700">Dashboard</Link>
          </div>
          {loading ? (
            <p className="mt-6 text-slate-600">Loading logs...</p>
          ) : (
            <div className="mt-5 space-y-3">
              {logs.map((log) => (
                <article key={log.id} className="flex items-start justify-between gap-4 rounded-md border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">{log.foodItem}</p>
                    <p className="mt-1 text-sm text-slate-500">{new Date(log.date).toLocaleDateString()} · {log.mealType.replace('_', ' ')} · {log.calories} kcal</p>
                    {log.notes && <p className="mt-2 text-sm text-slate-600">{log.notes}</p>}
                  </div>
                  <button onClick={() => deleteLog(log.id)} title="Delete food log" className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
              {!logs.length && <p className="text-slate-600">No food logs yet.</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default FoodLogPage

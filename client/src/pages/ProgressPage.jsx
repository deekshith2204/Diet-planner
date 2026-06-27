import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/client'
import FormField from '../components/FormField'
import SelectField from '../components/SelectField'
import getApiErrorMessage from '../utils/getApiErrorMessage'

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  weightKg: '',
  energyLevel: '3',
  notes: '',
}

function ProgressPage() {
  const [form, setForm] = useState(initialForm)
  const [progress, setProgress] = useState([])

  async function refreshProgress() {
    try {
      const { data } = await api.get('/progress')
      setProgress(data.progress)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not load progress'))
    }
  }

  useEffect(() => {
    async function loadProgress() {
      try {
        const { data } = await api.get('/progress')
        setProgress(data.progress)
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Could not load progress'))
      }
    }

    loadProgress()
  }, [])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.put('/progress', {
        ...form,
        weightKg: Number(form.weightKg),
        energyLevel: Number(form.energyLevel),
      })
      toast.success('Progress saved')
      setForm(initialForm)
      refreshProgress()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not save progress'))
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">PROGRESS</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Track weight and energy</h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Date" name="date" type="date" value={form.date} onChange={updateField} required />
            <FormField label="Weight (kg)" name="weightKg" type="number" min="30" max="300" value={form.weightKg} onChange={updateField} required />
            <SelectField label="Energy level" name="energyLevel" value={form.energyLevel} onChange={updateField}>
              <option value="1">1 - Very low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Okay</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Great</option>
            </SelectField>
            <FormField label="Notes" name="notes" value={form.notes} onChange={updateField} placeholder="Sleep, symptoms, mood, training..." />
            <button className="rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700">Save progress</button>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Weight trend</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress.map((entry) => ({ ...entry, date: new Date(entry.date).toLocaleDateString() }))}>
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="weightKg" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 space-y-3">
            {progress.map((entry) => (
              <article key={entry.id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{new Date(entry.date).toLocaleDateString()} · {entry.weightKg} kg</p>
                <p className="mt-1 text-sm text-slate-500">Energy {entry.energyLevel || 'not set'}/5</p>
                {entry.notes && <p className="mt-2 text-sm text-slate-600">{entry.notes}</p>}
              </article>
            ))}
            {!progress.length && <p className="text-slate-600">No progress entries yet.</p>}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProgressPage

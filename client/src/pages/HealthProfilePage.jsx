import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import FormField from '../components/FormField'
import SelectField from '../components/SelectField'
import {
  activityOptions,
  conditionOptions,
  dietaryPreferenceOptions,
  goalOptions,
} from '../constants/healthProfileOptions'
import getApiErrorMessage from '../utils/getApiErrorMessage'

const initialForm = {
  weightKg: '',
  heightCm: '',
  age: '',
  gender: 'female',
  goal: 'weight_loss',
  activityLevel: 'light',
  dietaryPreference: 'vegetarian',
  conditions: [],
}

function HealthProfilePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    async function loadExistingProfile() {
      try {
        const { data } = await api.get('/health-profile/me')
        setForm({
          weightKg: data.profile.weightKg,
          heightCm: data.profile.heightCm,
          age: data.profile.age,
          gender: data.profile.gender,
          goal: data.profile.goal,
          activityLevel: data.profile.activityLevel,
          dietaryPreference: data.profile.dietaryPreference,
          conditions: data.profile.conditions || [],
        })
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(getApiErrorMessage(error, 'Could not load health profile'))
        }
      } finally {
        setLoadingProfile(false)
      }
    }

    loadExistingProfile()
  }, [])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function toggleCondition(condition) {
    setForm((current) => ({
      ...current,
      conditions: current.conditions.includes(condition)
        ? current.conditions.filter((item) => item !== condition)
        : [...current.conditions, condition],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,
        weightKg: Number(form.weightKg),
        heightCm: Number(form.heightCm),
        age: Number(form.age),
      }
      const { data } = await api.put('/health-profile/me', payload)
      toast.success(`Profile saved. Target: ${data.profile.targetCalories} kcal/day`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not save health profile'))
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return <div className="grid min-h-screen place-items-center text-slate-600">Loading profile...</div>
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <section className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">HEALTH PROFILE</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Tell NutriAI what to plan around</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          These details calculate your calorie target and guide condition-aware meal planning.
        </p>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Weight (kg)" name="weightKg" type="number" min="30" max="300" value={form.weightKg} onChange={updateField} required />
            <FormField label="Height (cm)" name="heightCm" type="number" min="100" max="250" value={form.heightCm} onChange={updateField} required />
            <FormField label="Age" name="age" type="number" min="13" max="100" value={form.age} onChange={updateField} required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Gender" name="gender" value={form.gender} onChange={updateField}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </SelectField>
            <SelectField label="Goal" name="goal" value={form.goal} onChange={updateField}>
              {goalOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </SelectField>
            <SelectField label="Activity level" name="activityLevel" value={form.activityLevel} onChange={updateField}>
              {activityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </SelectField>
            <SelectField label="Dietary preference" name="dietaryPreference" value={form.dietaryPreference} onChange={updateField}>
              {dietaryPreferenceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </SelectField>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Medical conditions</legend>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {conditionOptions.map((condition) => (
                <label key={condition.value} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={form.conditions.includes(condition.value)}
                    onChange={() => toggleCondition(condition.value)}
                    className="size-4 accent-emerald-600"
                  />
                  <span>{condition.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button disabled={loading} className="rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? 'Saving profile...' : 'Save health profile'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default HealthProfilePage

import { Activity, ClipboardPlus, LogOut, Pencil, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useHealthProfile from '../hooks/useHealthProfile'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { profile, loading, missing } = useHealthProfile()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white"><Activity size={20} /></span>
            <span className="font-semibold">NutriAI</span>
          </div>
          <button onClick={handleLogout} title="Log out" className="flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-semibold text-emerald-700">ACCOUNT VERIFIED</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Welcome, {user.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Your health profile powers calorie targets and condition-aware meal plans.</p>

        {loading && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            Loading your health profile...
          </div>
        )}

        {missing && !loading && (
          <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <ClipboardPlus className="text-emerald-700" size={28} />
            <h2 className="mt-4 text-xl font-semibold text-slate-950">Set up your health profile</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add your goal, diet preference, activity level, and medical conditions before generating meal plans.
            </p>
            <Link to="/health-profile" className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Create profile
            </Link>
          </div>
        )}

        {profile && !loading && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">BMI</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{profile.bmi}</p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Daily target</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{profile.targetCalories} kcal</p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Conditions</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{profile.conditions.length || 'None selected'}</p>
            </article>
            <Link to="/health-profile" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white md:w-fit">
              <Pencil size={16} />
              Edit profile
            </Link>
            <Link to="/meal-plan" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white md:w-fit">
              <Sparkles size={16} />
              Generate meal plan
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage

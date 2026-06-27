import { Activity, ClipboardList, ClipboardPlus, LineChart as LineChartIcon, LogOut, Pencil, Scale, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useAuth from '../hooks/useAuth'
import useDashboardSummary from '../hooks/useDashboardSummary'
import useHealthProfile from '../hooks/useHealthProfile'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { profile, loading, missing } = useHealthProfile()
  const { summary, loading: summaryLoading } = useDashboardSummary()

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
            <Link to="/food-log" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 md:w-fit">
              <ClipboardList size={16} />
              Food diary
            </Link>
            <Link to="/progress" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 md:w-fit">
              <Scale size={16} />
              Progress
            </Link>
          </div>
        )}

        {profile && !loading && (
          <section className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Meal adherence</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{summaryLoading ? '...' : `${summary?.adherencePercent || 0}%`}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Target calories</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{summary?.targetCalories || profile.targetCalories}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Progress entries</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{summary?.weightTrend?.length || 0}</p>
              </article>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Calories consumed vs target</h2>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary?.dailyCalories || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="consumed" fill="#059669" name="Consumed" />
                      <Bar dataKey="target" fill="#94a3b8" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <LineChartIcon size={20} className="text-emerald-700" />
                  <h2 className="text-lg font-semibold text-slate-950">Weight trend</h2>
                </div>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={summary?.weightTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weightKg" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Condition-specific tips</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(summary?.conditionTips || []).map((tip) => (
                  <p key={tip} className="rounded-md bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{tip}</p>
                ))}
              </div>
            </article>
          </section>
        )}
      </section>
    </main>
  )
}

export default DashboardPage

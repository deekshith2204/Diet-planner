import { Activity, Bot, ClipboardList, ClipboardPlus, LineChart as LineChartIcon, LogOut, Pencil, Scale, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AppShell from '../components/AppShell'
import StatCard from '../components/StatCard'
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
    <AppShell
      eyebrow="Account verified"
      title={`Welcome, ${user.name}`}
      subtitle="Your health profile powers calorie targets, meal generation, food tracking, and progress insights."
      actions={
        <button onClick={handleLogout} title="Log out" className="secondary-action">
          <LogOut size={16} />
          Log out
        </button>
      }
    >
        {loading && (
          <div className="panel rounded-lg p-5 text-slate-600">
            Loading your health profile...
          </div>
        )}

        {missing && !loading && (
          <div className="panel rounded-lg p-6">
            <ClipboardPlus className="text-emerald-700" size={28} />
            <h2 className="mt-4 text-xl font-semibold text-slate-950">Set up your health profile</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add your goal, diet preference, activity level, and medical conditions before generating meal plans.
            </p>
            <Link to="/health-profile" className="primary-action mt-5">
              Create profile
            </Link>
          </div>
        )}

        {profile && !loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="BMI" value={profile.bmi} helper="Calculated from profile" icon={Activity} />
            <StatCard label="Daily target" value={`${profile.targetCalories} kcal`} helper="Goal-adjusted estimate" icon={Sparkles} />
            <StatCard label="Conditions" value={profile.conditions.length || 'None'} helper="Used for tips and meal safety" icon={Bot} />
            <Link to="/health-profile" className="secondary-action md:w-fit">
              <Pencil size={16} />
              Edit profile
            </Link>
            <Link to="/meal-plan" className="primary-action md:w-fit">
              <Sparkles size={16} />
              Generate meal plan
            </Link>
            <Link to="/food-log" className="secondary-action md:w-fit">
              <ClipboardList size={16} />
              Food diary
            </Link>
            <Link to="/progress" className="secondary-action md:w-fit">
              <Scale size={16} />
              Progress
            </Link>
            <Link to="/assistant" className="secondary-action md:w-fit">
              <Bot size={16} />
              AI assistant
            </Link>
          </div>
        )}

        {profile && !loading && (
          <section className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Meal adherence" value={summaryLoading ? '...' : `${summary?.adherencePercent || 0}%`} helper="Within 15% of target" />
              <StatCard label="Target calories" value={summary?.targetCalories || profile.targetCalories} helper="Current plan target" />
              <StatCard label="Progress entries" value={summary?.weightTrend?.length || 0} helper="Recent weigh-ins" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="panel rounded-lg p-5">
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

              <article className="panel rounded-lg p-5">
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

            <article className="panel rounded-lg p-5">
              <h2 className="text-lg font-semibold text-slate-950">Condition-specific tips</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(summary?.conditionTips || []).map((tip) => (
                  <p key={tip} className="rounded-md bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{tip}</p>
                ))}
              </div>
            </article>
          </section>
        )}
    </AppShell>
  )
}

export default DashboardPage

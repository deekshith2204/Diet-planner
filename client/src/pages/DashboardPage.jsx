import { Activity, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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
        <p className="mt-3 max-w-2xl text-slate-600">Authentication is complete. Health profile setup is the next project phase.</p>
      </section>
    </main>
  )
}

export default DashboardPage

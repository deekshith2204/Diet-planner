import { Activity, Bot, ClipboardList, LayoutDashboard, Salad, Scale, UserRound } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/meal-plan', label: 'Meal plan', icon: Salad },
  { to: '/food-log', label: 'Food diary', icon: ClipboardList },
  { to: '/progress', label: 'Progress', icon: Scale },
  { to: '/assistant', label: 'Assistant', icon: Bot },
  { to: '/health-profile', label: 'Profile', icon: UserRound },
]

function AppShell({ actions, children, eyebrow, title, subtitle }) {
  return (
    <main className="app-surface">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Activity size={22} />
            </span>
            <div>
              <p className="text-lg font-bold text-slate-950">NutriAI</p>
              <p className="text-xs font-medium text-slate-500">Medical-aware diet planner</p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        {children}
      </section>
    </main>
  )
}

export default AppShell

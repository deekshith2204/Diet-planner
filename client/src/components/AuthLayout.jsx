import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Activity size={22} />
          </span>
          <span className="text-xl font-semibold text-slate-950">NutriAI</span>
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm">{footer}</div>}
        </section>
      </div>
    </main>
  )
}

export default AuthLayout

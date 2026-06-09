import { Activity, Apple, ChartNoAxesColumnIncreasing, ShieldCheck } from 'lucide-react'

function App() {
  const features = [
    {
      icon: Apple,
      title: 'Condition-aware plans',
      text: 'Meal plans account for goals, dietary preference, and medical conditions.',
    },
    {
      icon: ShieldCheck,
      title: 'OTP-ready security',
      text: 'The backend is prepared for email verification and optional SMS login 2FA.',
    },
    {
      icon: ChartNoAxesColumnIncreasing,
      title: 'Progress tracking',
      text: 'Food logs, weight entries, and adherence charts are part of the data model.',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Activity size={22} />
            </span>
            <div>
              <p className="text-lg font-semibold">NutriAI</p>
              <p className="text-sm text-slate-500">Medical-aware diet planner</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#stack">Stack</a>
            <a href="#phase">Phase 1</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
            MERN scaffold ready
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
            Personalised diet planning for real health profiles.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Build meal plans around goals, dietary preferences, and conditions like GERD,
            IBS, diabetes, high cholesterol, hypertension, PCOS, and intolerances.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              React + Tailwind
            </span>
            <span className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              Express + MongoDB
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Today&apos;s Plan Preview</h2>
              <p className="text-sm text-slate-500">Sample dashboard shell</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
              1,850 kcal
            </span>
          </div>
          {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((meal, index) => (
            <div key={meal} className="flex items-center justify-between border-t border-slate-100 py-4">
              <div>
                <p className="font-medium">{meal}</p>
                <p className="text-sm text-slate-500">
                  {index % 2 === 0 ? 'High-fibre balanced option' : 'Low-irritant protein meal'}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{360 + index * 95} kcal</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-6 pb-12 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <feature.icon className="mb-4 text-emerald-700" size={24} />
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>

      <section id="phase" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Phase 1 Complete Foundation</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2" id="stack">
            <p>Frontend: Vite, React, Tailwind, Router, Axios, Recharts, Lucide.</p>
            <p>Backend: Express MVC, Mongoose models, Helmet, CORS, rate limiting, validation-ready routes.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App

function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
        </div>
        {Icon && (
          <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Icon size={20} />
          </span>
        )}
      </div>
    </article>
  )
}

export default StatCard

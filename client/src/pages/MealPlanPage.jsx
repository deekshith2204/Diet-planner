import { Bot, RefreshCw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../api/client'
import useMealPlan from '../hooks/useMealPlan'
import getApiErrorMessage from '../utils/getApiErrorMessage'

function MealPlanPage() {
  const { mealPlan, loading, missing, setMealPlan, setMissing } = useMealPlan()
  const [generating, setGenerating] = useState(false)

  async function generatePlan() {
    setGenerating(true)

    try {
      const { data } = await api.post('/meal-plans/generate')
      setMealPlan(data.mealPlan)
      setMissing(false)
      toast.success(data.mealPlan.generatedBy === 'ai' ? 'AI meal plan generated' : 'Demo meal plan generated')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not generate meal plan'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">AI MEAL PLAN</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Today&apos;s condition-aware plan</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Generate breakfast, snacks, lunch, and dinner from your saved health profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              Dashboard
            </Link>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {generating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {mealPlan ? 'Regenerate' : 'Generate plan'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
            Loading meal plan...
          </div>
        )}

        {missing && !loading && (
          <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <Bot className="text-emerald-700" size={28} />
            <h2 className="mt-4 text-xl font-semibold text-slate-950">No meal plan yet</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Generate your first plan for today. If you have not created a health profile, NutriAI will ask you to do that first.
            </p>
          </div>
        )}

        {mealPlan && !loading && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Calories</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{mealPlan.totalCalories}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Protein</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{mealPlan.totalProteinG}g</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Carbs</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{mealPlan.totalCarbsG}g</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Fat</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{mealPlan.totalFatG}g</p>
              </article>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {mealPlan.meals.map((meal) => (
                <article key={meal.mealType} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{meal.mealType.replace('_', ' ')}</p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-950">{meal.name}</h2>
                    </div>
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{meal.calories} kcal</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{meal.preparationTip}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient) => (
                      <span key={ingredient} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{ingredient}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Foods to avoid</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {mealPlan.foodsToAvoid.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Condition tips</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {mealPlan.conditionTips.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default MealPlanPage

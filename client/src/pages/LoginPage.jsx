import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const { completeAuthentication } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)

      if (data.requiresSmsOtp) {
        sessionStorage.setItem('nutriai_sms_challenge', data.challengeId)
        navigate('/verify-sms')
        return
      }

      completeAuthentication(data)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view your meal plan and health progress."
      footer={<p>New to NutriAI? <Link className="font-semibold text-emerald-700" to="/register">Create an account</Link></p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email address" name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required />
        <button disabled={loading} className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage

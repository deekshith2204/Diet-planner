import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/register', form)
      sessionStorage.setItem('nutriai_pending_email', form.email)
      toast.success('Verification code sent')
      navigate('/verify-email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start with email verification. You can enable SMS login security from your profile later."
      footer={<p>Already registered? <Link className="font-semibold text-emerald-700" to="/login">Sign in</Link></p>}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Full name" name="name" value={form.name} onChange={updateField} autoComplete="name" required />
        <FormField label="Email address" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
        <FormField label="Phone number (optional)" name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" placeholder="+353..." />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={updateField} autoComplete="new-password" minLength="8" required />
        <p className="text-xs leading-5 text-slate-500">Use at least 8 characters with uppercase, lowercase, and a number.</p>
        <button disabled={loading} className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Sending code...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage

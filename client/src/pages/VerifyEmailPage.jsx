import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { completeAuthentication } = useAuth()
  const [email, setEmail] = useState(sessionStorage.getItem('nutriai_pending_email') || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/verify-email', { email, otp })
      completeAuthentication(data)
      sessionStorage.removeItem('nutriai_pending_email')
      toast.success('Email verified')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function resendCode() {
    try {
      await api.post('/auth/resend-email-otp', { email })
      toast.success('A new code was sent')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not resend code')
    }
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the six-digit code sent to your email. It expires after five minutes.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <FormField label="Verification code" inputMode="numeric" pattern="\d{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required />
        <button disabled={loading} className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Verifying...' : 'Verify email'}
        </button>
        <button type="button" onClick={resendCode} className="w-full text-sm font-semibold text-emerald-700">Send a new code</button>
      </form>
    </AuthLayout>
  )
}

export default VerifyEmailPage

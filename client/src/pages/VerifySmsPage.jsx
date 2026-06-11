import { useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../api/client'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import useAuth from '../hooks/useAuth'

function VerifySmsPage() {
  const navigate = useNavigate()
  const { completeAuthentication } = useAuth()
  const challengeId = sessionStorage.getItem('nutriai_sms_challenge')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  if (!challengeId) {
    return <Navigate to="/login" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/verify-sms', { challengeId, otp })
      completeAuthentication(data)
      sessionStorage.removeItem('nutriai_sms_challenge')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'SMS verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Confirm your login" subtitle="Enter the six-digit code sent to your phone.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="SMS code" inputMode="numeric" pattern="\d{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required />
        <button disabled={loading} className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Checking code...' : 'Complete login'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default VerifySmsPage

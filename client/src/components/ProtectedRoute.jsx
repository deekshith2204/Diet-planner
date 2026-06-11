import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-600">Loading account...</div>
  }

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/authStore'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DashboardPage from './pages/Dashboard' // Placeholder for authenticated users

// A simple protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to login or dashboard based on auth status */}
          <Route path="/" element={<AuthRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Component to handle initial redirection based on authentication status
function AuthRedirect() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export default App
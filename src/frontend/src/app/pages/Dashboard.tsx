import React from 'react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to the Dashboard!</h1>
        <p className="text-lg text-gray-600 mb-8">
          You have successfully logged in. This is a protected area.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
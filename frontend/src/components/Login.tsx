import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type UserRole = 'admin' | 'staff'

interface Credentials {
  username: string
  password: string
}

interface DemoUser {
  username: string
  password: string
  role: UserRole
  userData: {
    id: number
    name: string
    email: string
  }
}

interface LoginSuccessResponse {
  success: true
  token: string
  role: UserRole
  userData: DemoUser['userData']
}

interface LoginFailureResponse {
  success: false
}

type LoginResponse = LoginSuccessResponse | LoginFailureResponse

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await simulateLogin(credentials)
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('userRole', response.role)
        localStorage.setItem('userData', JSON.stringify(response.userData))
        if (response.role === 'admin') navigate('/admin-dashboard')
        else if (response.role === 'staff') navigate('/staff-dashboard')
        else navigate('/404')
      } else {
        setError('Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const simulateLogin = async (credentials: Credentials): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUsers: Record<UserRole, DemoUser> = {
      admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        userData: { id: 1, name: 'Admin User', email: 'admin@airline.com' },
      },
      staff: {
        username: 'staff',
        password: 'staff123',
        role: 'staff',
        userData: { id: 2, name: 'Staff User', email: 'staff@airline.com' },
      },
    }

    const user = Object.values(demoUsers).find(
      (user) => user.username === credentials.username && user.password === credentials.password,
    )

    if (user) {
      const mockToken = btoa(
        JSON.stringify({ user: user.userData, role: user.role, exp: Date.now() + 24 * 60 * 60 * 1000 }),
      )
      return { success: true, token: mockToken, role: user.role, userData: user.userData }
    }

    return { success: false }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Airline Management System</h1>
          <p className="text-gray-600 text-sm">Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> admin/admin123 or staff/staff123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login



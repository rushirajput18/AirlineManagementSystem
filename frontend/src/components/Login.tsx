import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, clearAuthData, getTokenPayload, JWTPayload } from '../utils/auth'


type UserRole = 'admin' | 'staff'

// JWT types are now imported from utils/auth

interface Credentials {
  username: string
  password: string
}

interface DemoUser {
  username: string
  role: UserRole
  userData: string
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
  const location = useLocation()
  const tokenUrl = import.meta.env.VITE_AUTH_SERVICE_URL;

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (isAuthenticated()) {
      const role = localStorage.getItem('userRole')
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true })
      } else if (role === 'staff') {
        navigate('/staff-dashboard', { replace: true })
      }
    }
  }, [navigate])

  // Clear any expired auth data on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      clearAuthData()
    }
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const parseJWT = (token: string) => {
    const payload = getTokenPayload(token);
    if (!payload) {
      throw new Error("Invalid JWT format");
    }
    return { payload };
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
        localStorage.setItem('userData', response.userData)
        
        // Redirect to the intended page or default dashboard
        const from = location.state?.from?.pathname
        if (response.role === 'admin') {
          navigate(from || '/admin-dashboard', { replace: true })
        } else if (response.role === 'staff') {
          navigate(from || '/staff-dashboard', { replace: true })
        } else {
          navigate('/404', { replace: true })
        }
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
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const response = await fetch(`${tokenUrl}/auth/generateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Token generation failed');
      }

      const token = await response.text();
      const { payload } = parseJWT(token);
      
      if (payload.role === "ROLE_ADMIN") {
          return { success: true, token, role: "admin", userData: payload.sub?.split("@")[0] ?? "" };
        } else if (payload.role === "ROLE_STAFF") {
          return { success: true, token, role: "staff", userData: payload.sub?.split("@")[0] ?? "" };
        }

      return { success: false };
    } catch (error) {
        console.error('Login simulation error:', error);
        return { success: false };
    }
  };

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

        
      </div>
    </div>
  )
}

export default Login



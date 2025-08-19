import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-2">Oops! The page you're looking for doesn't exist.</p>
          <p className="text-gray-500">It might have been moved, deleted, or you entered the wrong URL.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button onClick={handleGoHome} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all">
            Go to Login
          </button>
          <button onClick={() => window.history.back()} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transform hover:-translate-y-1 transition-all">
            Go Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600">If you believe this is an error, please contact your system administrator.</p>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-10">✈️</div>
          <div className="absolute top-40 right-20 text-4xl opacity-10">☁️</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-10">☁️</div>
          <div className="absolute bottom-40 right-10 text-3xl opacity-10">✈️</div>
        </div>
      </div>
    </div>
  )
}

export default NotFound



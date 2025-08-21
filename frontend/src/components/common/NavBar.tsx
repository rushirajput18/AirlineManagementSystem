import React, { useState } from 'react'

interface NavBarProps {
  title: string
  subtitle?: string
  userName?: string
  onLogout?: () => void
  onSearch?: (query: string) => void
  showSearch?: boolean
}

const NavBar: React.FC<NavBarProps> = ({ title, subtitle, userName, onLogout, onSearch, showSearch = false }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {subtitle}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch && onSearch && (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search flights"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Search
                </button>
              </form>
            )}
            {userName && <span className="text-gray-600">Welcome, {userName}</span>}
            {onLogout && (
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar



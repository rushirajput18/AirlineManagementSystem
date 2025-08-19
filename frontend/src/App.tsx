import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/login/LoginPage'
import AdminDashboard from './features/admin/AdminDashboard'
import StaffDashboard from './features/staff/StaffDashboard'
import NotFound from './components/NotFound'

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  )
}

export default App



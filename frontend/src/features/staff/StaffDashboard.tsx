import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import AssignedFlightsTable from './components/AssignedFlightsTable'
import { AssignedFlightRow, UserData } from '../../types'

const StaffDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<AssignedFlightRow | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showInFlightModal, setShowInFlightModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const storedUserData = localStorage.getItem('userData')
    if (!token || userRole !== 'staff') {
      navigate('/login')
      return
    }
    if (storedUserData) setUserData(JSON.parse(storedUserData) as UserData)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    navigate('/login')
  }

  const dashboardStats = useMemo(
    () => [
      { title: 'Assigned Flights', value: '8', icon: '✈️', color: 'from-blue-500 to-blue-600' },
      { title: 'Pending Check-ins', value: '23', icon: '📋', color: 'from-red-500 to-red-600' },
      { title: 'Completed Check-ins', value: '156', icon: '✅', color: 'from-green-500 to-green-600' },
      { title: 'In-Flight Services', value: '12', icon: '🛎️', color: 'from-yellow-500 to-yellow-600' },
    ],
    [],
  )

  const assignedFlights: AssignedFlightRow[] = useMemo(
    () => [
      { id: 'FL001', name: 'New York Express', destination: 'New York', departure: '09:00 AM', status: 'Boarding', checkInStatus: 'In Progress', passengers: 45, checkedIn: 32 },
      { id: 'FL002', name: 'Los Angeles Direct', destination: 'Los Angeles', departure: '11:30 AM', status: 'Check-in Open', checkInStatus: 'Open', passengers: 38, checkedIn: 15 },
      { id: 'FL003', name: 'Chicago Connect', destination: 'Chicago', departure: '02:15 PM', status: 'In Flight', checkInStatus: 'Closed', passengers: 42, checkedIn: 42 },
      { id: 'FL004', name: 'Miami Beach', destination: 'Miami', departure: '04:45 PM', status: 'Scheduled', checkInStatus: 'Not Started', passengers: 35, checkedIn: 0 },
    ],
    [],
  )

  const handleCheckInService = (flight: AssignedFlightRow) => {
    setSelectedFlight(flight)
    setShowCheckInModal(true)
  }

  const handleInFlightService = (flight: AssignedFlightRow) => {
    setSelectedFlight(flight)
    setShowInFlightModal(true)
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar title="Airline Management System" subtitle="Staff Dashboard" userName={userData.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here are your assigned flights and tasks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Assigned Flights</h3>
            <div className="text-sm text-gray-600">Total Flights: {assignedFlights.length}</div>
          </div>
          <AssignedFlightsTable flights={assignedFlights} onCheckIn={handleCheckInService} onInFlight={handleInFlightService} />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all">View Seat Map</button>
            <button className="bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-200 transform hover:-translate-y-1 transition-all border-2 border-gray-200">Passenger List</button>
            <button className="bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-200 transform hover:-translate-y-1 transition-all border-2 border-gray-200">Meal Preferences</button>
            <button className="bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold hover:bg-gray-200 transform hover:-translate-y-1 transition-all border-2 border-gray-200">Ancillary Services</button>
          </div>
        </Card>
      </div>

      <Modal isOpen={showCheckInModal} title={`Check-in Service - ${selectedFlight?.name} (${selectedFlight?.id})`} onClose={() => setShowCheckInModal(false)} className="max-w-4xl w-full">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Passenger Management</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Get all passengers with seat and check-in status</li>
                <li>• Filter by wheelchair need, infant status</li>
                <li>• Check-in/Check-out passengers</li>
                <li>• Assign available seats</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Seat Management</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Display seat map with availability</li>
                <li>• View occupied and available seats</li>
                <li>• Assign seats during check-in</li>
                <li>• Release seats during check-out</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">View Passengers</button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">View Seat Map</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showInFlightModal} title={`In-Flight Service - ${selectedFlight?.name} (${selectedFlight?.id})`} onClose={() => setShowInFlightModal(false)} className="max-w-4xl w-full">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Meal Services</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Select meal preferences</li>
                <li>• Update meal choices</li>
                <li>• Special dietary requirements</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Ancillary Services</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Select ancillary services</li>
                <li>• Update service selections</li>
                <li>• Premium amenities</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Shopping</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• In-flight shopping items</li>
                <li>• Duty-free products</li>
                <li>• Update shopping selections</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">Meal Preferences</button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">Ancillary Services</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">Shopping</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default StaffDashboard



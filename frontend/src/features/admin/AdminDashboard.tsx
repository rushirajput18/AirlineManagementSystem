import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import FlightTable from './components/FlightTable'
import NewFlightForm from './components/NewFlightForm'
import NewPassengerForm from './components/NewPassengerForm'
import PassengerListTable from './components/PassengerListTable'
import { FlightRow, NewFlight, NewPassenger, PassengerRow, UserData } from '../../types'

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<FlightRow | null>(null)
  const [showPassengerModal, setShowPassengerModal] = useState(false)
  const [showNewPassengerModal, setShowNewPassengerModal] = useState(false)
  const [showNewFlightModal, setShowNewFlightModal] = useState(false)
  const [showPassengerListModal, setShowPassengerListModal] = useState(false)
  const [passengers, setPassengers] = useState<PassengerRow[]>([])
  const [newPassenger, setNewPassenger] = useState<NewPassenger>({
    name: '',
    date_of_birth: '',
    passport: '',
    address: '',
    meal_preference: 'veg',
    need_wheelchair: false,
    travelling_with_infant: false,
  })
  const [newFlight, setNewFlight] = useState<NewFlight>({ flight_number: '', flight_route: '', departure_time: '', arrival_time: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const storedUserData = localStorage.getItem('userData')
    if (!token || userRole !== 'admin') {
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

  const flights: FlightRow[] = useMemo(
    () => [
      { id: 101, flight_number: 'AA101', flight_route: 'New York to Los Angeles', departure_time: '2024-01-15 09:00:00', arrival_time: '2024-01-15 12:30:00' },
      { id: 102, flight_number: 'AA102', flight_route: 'Chicago to Miami', departure_time: '2024-01-15 11:30:00', arrival_time: '2024-01-15 15:45:00' },
      { id: 103, flight_number: 'AA103', flight_route: 'Seattle to Denver', departure_time: '2024-01-15 14:15:00', arrival_time: '2024-01-15 17:30:00' },
      { id: 104, flight_number: 'AA104', flight_route: 'Boston to San Francisco', departure_time: '2024-01-15 16:45:00', arrival_time: '2024-01-15 20:15:00' },
    ],
    [],
  )

  const handlePassengerManagement = (flight: FlightRow) => {
    setSelectedFlight(flight)
    setShowPassengerModal(true)
  }

  const handleViewPassengers = () => {
    const mockPassengers: PassengerRow[] = [
      { id: 1, name: 'John Doe', date_of_birth: '1990-05-15', passport: 'A12345678', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false },
      { id: 2, name: 'Jane Smith', date_of_birth: '1985-08-22', passport: 'B87654321', meal_preference: 'non-veg', need_wheelchair: true, travelling_with_infant: false },
      { id: 3, name: 'Mike Johnson', date_of_birth: '1992-12-10', passport: 'C11223344', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: true },
    ]
    setPassengers(mockPassengers)
    setShowPassengerListModal(true)
  }

  const handleNewPassengerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Adding new passenger:', newPassenger)
    setShowNewPassengerModal(false)
    setNewPassenger({ name: '', date_of_birth: '', passport: '', address: '', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false })
  }

  const handleNewFlightSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Adding new flight:', newFlight)
    setShowNewFlightModal(false)
    setNewFlight({ flight_number: '', flight_route: '', departure_time: '', arrival_time: '' })
  }

  const handlePassengerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type } = e.target
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setNewPassenger((prev) => ({ ...prev, [name]: value } as NewPassenger))
  }

  const handleFlightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewFlight((prev) => ({ ...prev, [name]: value }))
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
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
      <NavBar title="Airline Management System" userName={userData.name} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your airline operations efficiently.</p>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Flight Management</h3>
            <button onClick={() => setShowNewFlightModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all">
              Add New Flight
            </button>
          </div>
          <FlightTable flights={flights} onManagePassengers={handlePassengerManagement} formatDateTime={formatDateTime} />
        </Card>
      </div>

      <Modal isOpen={showPassengerModal} title={`Passenger Management - ${selectedFlight?.flight_number} (${selectedFlight?.id})`} onClose={() => setShowPassengerModal(false)} className="max-w-4xl w-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage passengers for this flight</p>
            <button onClick={() => setShowNewPassengerModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add New Passenger
            </button>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleViewPassengers} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              View All Passengers
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showNewPassengerModal} title="Add New Passenger" onClose={() => setShowNewPassengerModal(false)} className="max-w-2xl w-full">
        <NewPassengerForm form={newPassenger} onChange={handlePassengerChange} onSubmit={handleNewPassengerSubmit} />
      </Modal>

      <Modal isOpen={showNewFlightModal} title="Add New Flight" onClose={() => setShowNewFlightModal(false)} className="max-w-2xl w-full">
        <NewFlightForm form={newFlight} onChange={handleFlightChange} onSubmit={handleNewFlightSubmit} />
      </Modal>

      <Modal isOpen={showPassengerListModal} title={`Passengers - ${selectedFlight?.flight_number} (${selectedFlight?.id})`} onClose={() => setShowPassengerListModal(false)} className="max-w-6xl w-full">
        <PassengerListTable passengers={passengers} />
      </Modal>
    </div>
  )
}

export default AdminDashboard



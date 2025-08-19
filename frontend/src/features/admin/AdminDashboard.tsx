import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import FlightTable from './components/FlightTable'
import NewFlightForm from './components/NewFlightForm'
import NewPassengerForm from './components/NewPassengerForm'
import PassengerListTable from './components/PassengerListTable'
import FlightServicesModal from './components/FlightServicesModal'
import { FlightRow, NewFlight, NewPassenger, PassengerRow, UserData, PassengerFilters, FlightServiceItem, NewServiceItem } from '../../types'

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<FlightRow | null>(null)
  const [showPassengerModal, setShowPassengerModal] = useState(false)
  const [showNewPassengerModal, setShowNewPassengerModal] = useState(false)
  const [showNewFlightModal, setShowNewFlightModal] = useState(false)
  const [passengers, setPassengers] = useState<PassengerRow[]>([])
  const [passengerFilters, setPassengerFilters] = useState<PassengerFilters>({ missingDOB: false, missingPassport: false, missingAddress: false })
  const [showPassengerEditModal, setShowPassengerEditModal] = useState(false)
  const [passengerToEdit, setPassengerToEdit] = useState<PassengerRow | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [serviceFlight, setServiceFlight] = useState<FlightRow | null>(null)
  const [services, setServices] = useState<Record<number, FlightServiceItem[]>>({})
  const [newPassenger, setNewPassenger] = useState<NewPassenger>({
    name: '',
    date_of_birth: '',
    passport: '',
    address: '',
    meal_preference: 'veg',
    need_wheelchair: false,
    travelling_with_infant: false,
  })
  const [newFlight, setNewFlight] = useState<NewFlight>({ flight_number: '', flight_route: '', departure_time: '', arrival_time: '', departure: '', destination: '' })
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

  const [flights, setFlights] = useState<FlightRow[]>([
      { id: 101, flight_number: 'AA101', flight_route: 'New York to Los Angeles', departure_time: '2024-01-15 09:00:00', arrival_time: '2024-01-15 12:30:00' },
      { id: 102, flight_number: 'AA102', flight_route: 'Chicago to Miami', departure_time: '2024-01-15 11:30:00', arrival_time: '2024-01-15 15:45:00' },
      { id: 103, flight_number: 'AA103', flight_route: 'Seattle to Denver', departure_time: '2024-01-15 14:15:00', arrival_time: '2024-01-15 17:30:00' },
      { id: 104, flight_number: 'AA104', flight_route: 'Boston to San Francisco', departure_time: '2024-01-15 16:45:00', arrival_time: '2024-01-15 20:15:00' },
  ])

  const handlePassengerManagement = (flight: FlightRow) => {
    setSelectedFlight(flight)
    setShowPassengerModal(true)
  }

  const handleViewPassengers = () => {
    const mockPassengers: PassengerRow[] = [
      { id: 1, name: 'John Doe', date_of_birth: '1990-05-15', passport: 'A12345678', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false, address: '123 Main St' },
      { id: 2, name: 'Jane Smith', date_of_birth: '', passport: 'B87654321', meal_preference: 'non-veg', need_wheelchair: true, travelling_with_infant: false, address: '' },
      { id: 3, name: 'Mike Johnson', date_of_birth: '1992-12-10', passport: '', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: true },
    ]
    setPassengers(mockPassengers)
  }

  const handleNewPassengerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Adding new passenger:', newPassenger)
    setShowNewPassengerModal(false)
    setNewPassenger({ name: '', date_of_birth: '', passport: '', address: '', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false })
  }

  const handleNewFlightSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const composedRoute = (newFlight.departure || newFlight.destination) ? `${newFlight.departure || ''} to ${newFlight.destination || ''}`.trim() : newFlight.flight_route
    const route = composedRoute || ''
    const nextId = flights.length ? Math.max(...flights.map((f) => f.id)) + 1 : 1
    const toAdd: FlightRow = {
      id: nextId,
      flight_number: newFlight.flight_number,
      flight_route: route,
      departure_time: newFlight.departure_time,
      arrival_time: newFlight.arrival_time,
    }
    setFlights((prev) => [...prev, toAdd])
    setShowNewFlightModal(false)
    setNewFlight({ flight_number: '', flight_route: '', departure_time: '', arrival_time: '', departure: '', destination: '' })
  }

  const filteredPassengers = useMemo(() => {
    return passengers.filter((p) => {
      if (passengerFilters.missingDOB && p.date_of_birth) return false
      if (passengerFilters.missingPassport && p.passport) return false
      if (passengerFilters.missingAddress && p.address) return false
      return true
    })
  }, [passengers, passengerFilters])

  const handlePassengerEditClick = (p: PassengerRow) => {
    setPassengerToEdit(p)
    setShowPassengerEditModal(true)
  }

  const handlePassengerRemove = (p: PassengerRow) => {
    setPassengers((prev) => prev.filter((x) => x.id !== p.id))
  }

  const handlePassengerEditSave = (updated: PassengerRow) => {
    setPassengers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
    setShowPassengerEditModal(false)
    setPassengerToEdit(null)
  }

  const handleOpenServices = (flight: FlightRow) => {
    setServiceFlight(flight)
    if (!services[flight.id]) {
      setServices((prev) => ({
        ...prev,
        [flight.id]: [
          { id: 1, category: 'ancillary', name: 'Extra Baggage', price: 30 },
          { id: 2, category: 'meal', name: 'Chicken Meal', meal_type: 'non-veg', price: 12 },
          { id: 3, category: 'shopping', name: 'Headphones', price: 25 },
        ],
      }))
    }
    setShowServiceModal(true)
  }

  const handleAddService = (flightId: number, item: NewServiceItem) => {
    setServices((prev) => {
      const list = prev[flightId] || []
      const nextId = list.length ? Math.max(...list.map((s) => s.id)) + 1 : 1
      return { ...prev, [flightId]: [...list, { ...(item as any), id: nextId }] }
    })
  }

  const handleUpdateService = (flightId: number, updated: FlightServiceItem) => {
    setServices((prev) => ({
      ...prev,
      [flightId]: (prev[flightId] || []).map((s) => (s.id === updated.id ? updated : s)),
    }))
  }

  const handleDeleteService = (flightId: number, serviceId: number) => {
    setServices((prev) => ({
      ...prev,
      [flightId]: (prev[flightId] || []).filter((s) => s.id !== serviceId),
    }))
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
    setNewFlight((prev) => {
      const next = { ...prev, [name]: value } as NewFlight
      const departure = (name === 'departure' ? value : next.departure) || ''
      const destination = (name === 'destination' ? value : next.destination) || ''
      return {
        ...next,
        flight_route: departure || destination ? `${departure} to ${destination}`.trim() : next.flight_route,
      }
    })
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
          <FlightTable flights={flights} onManagePassengers={handlePassengerManagement} onManageServices={handleOpenServices} formatDateTime={formatDateTime} />
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Passenger filters:</span>
            <label className="text-sm text-gray-700 flex items-center space-x-1">
              <input type="checkbox" checked={passengerFilters.missingDOB} onChange={(e) => setPassengerFilters((f) => ({ ...f, missingDOB: e.target.checked }))} />
              <span>Missing DOB</span>
            </label>
            <label className="text-sm text-gray-700 flex items-center space-x-1">
              <input type="checkbox" checked={passengerFilters.missingPassport} onChange={(e) => setPassengerFilters((f) => ({ ...f, missingPassport: e.target.checked }))} />
              <span>Missing Passport</span>
            </label>
            <label className="text-sm text-gray-700 flex items-center space-x-1">
              <input type="checkbox" checked={passengerFilters.missingAddress} onChange={(e) => setPassengerFilters((f) => ({ ...f, missingAddress: e.target.checked }))} />
              <span>Missing Address</span>
            </label>
          </div>
        </Card>
      </div>

      <Modal isOpen={showPassengerModal} title={`Passenger Management - ${selectedFlight?.flight_number} (${selectedFlight?.id})`} onClose={() => setShowPassengerModal(false)} className="max-w-5xl w-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage passengers for this flight</p>
            <div className="flex space-x-2">
              <button onClick={() => setShowNewPassengerModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Passenger</button>
              <button onClick={() => selectedFlight && handleOpenServices(selectedFlight)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">Manage Services</button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleViewPassengers} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              View All Passengers
            </button>
          </div>
          <PassengerListTable passengers={filteredPassengers} onEdit={handlePassengerEditClick} onRemove={handlePassengerRemove} />
        </div>
      </Modal>

      <Modal isOpen={showNewPassengerModal} title="Add New Passenger" onClose={() => setShowNewPassengerModal(false)} className="max-w-2xl w-full">
        <NewPassengerForm form={newPassenger} onChange={handlePassengerChange} onSubmit={handleNewPassengerSubmit} />
      </Modal>

      <Modal isOpen={showNewFlightModal} title="Add New Flight" onClose={() => setShowNewFlightModal(false)} className="max-w-2xl w-full">
        <NewFlightForm form={newFlight} onChange={handleFlightChange} onSubmit={handleNewFlightSubmit} />
      </Modal>

      {/* Inline passenger list only; no popup for "View All Passengers" as per request */}

      <Modal isOpen={showPassengerEditModal} title={`Edit Passenger`} onClose={() => setShowPassengerEditModal(false)} className="max-w-xl w-full">
        {passengerToEdit && (
          <form onSubmit={(e) => { e.preventDefault(); handlePassengerEditSave(passengerToEdit) }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={passengerToEdit.name} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={passengerToEdit.date_of_birth} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, date_of_birth: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input type="text" value={passengerToEdit.passport} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, passport: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                <select value={passengerToEdit.meal_preference} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, meal_preference: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={passengerToEdit.address || ''} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, address: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="checkbox" checked={passengerToEdit.need_wheelchair} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, need_wheelchair: e.target.checked })} className="mr-2" />
                <span className="text-sm text-gray-700">Need Wheelchair</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={passengerToEdit.travelling_with_infant} onChange={(e) => setPassengerToEdit({ ...passengerToEdit, travelling_with_infant: e.target.checked })} className="mr-2" />
                <span className="text-sm text-gray-700">Travelling with Infant</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setShowPassengerEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={showServiceModal} title={`Services - ${serviceFlight?.flight_number} (${serviceFlight?.id})`} onClose={() => setShowServiceModal(false)} className="max-w-4xl w-full">
        <FlightServicesModal
          isOpen={showServiceModal}
          flight={serviceFlight}
          services={serviceFlight ? (services[serviceFlight.id] || []) : []}
          onAdd={handleAddService}
          onUpdate={handleUpdateService}
          onDelete={handleDeleteService}
          onClose={() => setShowServiceModal(false)}
        />
      </Modal>
    </div>
  )
}

export default AdminDashboard



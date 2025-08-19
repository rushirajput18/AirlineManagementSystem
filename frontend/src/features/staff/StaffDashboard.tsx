import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import AssignedFlightsTable from './components/AssignedFlightsTable'
import CheckInPanel from './components/CheckInPanel'
import InFlightPanel from './components/InFlightPanel'
import { AssignedFlightRow, UserData, PassengerCheckInRow, SeatCell, PassengerInFlightRow, FlightServiceItem } from '../../types'

const StaffDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<AssignedFlightRow | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showInFlightModal, setShowInFlightModal] = useState(false)
  const [checkInPassengers, setCheckInPassengers] = useState<PassengerCheckInRow[]>([])
  const [seatMap, setSeatMap] = useState<SeatCell[]>([])
  const [inFlightPassengers, setInFlightPassengers] = useState<PassengerInFlightRow[]>([])
  const [flightServices, setFlightServices] = useState<FlightServiceItem[]>([ 
    { id: 1, category: 'ancillary', name: 'Extra Baggage', price: 30 } as any,
    { id: 2, category: 'ancillary', name: 'Priority Boarding', price: 15 } as any,
    { id: 3, category: 'meal', name: 'Veg Meal', meal_type: 'veg', price: 10 } as any,
    { id: 4, category: 'meal', name: 'Chicken Meal', meal_type: 'non-veg', price: 12 } as any,
    { id: 5, category: 'shopping', name: 'Headphones', price: 25 } as any,
    { id: 6, category: 'shopping', name: 'Neck Pillow', price: 18 } as any,
  ])
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
    // Mock passengers
    const mock: PassengerCheckInRow[] = [
      { id: 1, name: 'Alice Brown', date_of_birth: '1991-04-20', passport: 'P1234', address: '221B Baker St', seat_no: null, checked_in: false, need_wheelchair: false, travelling_with_infant: false },
      { id: 2, name: 'Bob Clark', date_of_birth: '', passport: '', address: '', seat_no: '12A', checked_in: true, need_wheelchair: true, travelling_with_infant: false },
      { id: 3, name: 'Carol Davis', date_of_birth: '1988-12-05', passport: 'Z9876', address: '742 Evergreen', seat_no: null, checked_in: false, need_wheelchair: false, travelling_with_infant: true },
    ]
    setCheckInPassengers(mock)
    // Mock seat map (36 seats)
    const seats: SeatCell[] = Array.from({ length: 36 }).map((_, idx) => {
      const row = Math.floor(idx / 6) + 1
      const col = String.fromCharCode(65 + (idx % 6))
      const seat_no = `${row}${col}`
      const occupied = mock.some((p) => p.seat_no === seat_no)
      const passenger = mock.find((p) => p.seat_no === seat_no)
      return { seat_no, occupied, passenger_id: passenger?.id }
    })
    setSeatMap(seats)
    setShowCheckInModal(true)
  }

  const handleInFlightService = (flight: AssignedFlightRow) => {
    setSelectedFlight(flight)
    // Mock passengers in-flight: derive from check-in list
    const base: PassengerInFlightRow[] = checkInPassengers.map((p) => ({
      ...p,
      meal_preference: 'veg',
      selected_ancillary_ids: [],
      selected_meal_id: undefined,
      selected_shopping_item_ids: [],
    }))
    setInFlightPassengers(base)
    setShowInFlightModal(true)
  }

  const handleAssignSeat = (passengerId: number, seatNo: string) => {
    setCheckInPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, seat_no: seatNo } : p)))
    setSeatMap((prev) => prev.map((s) => (s.seat_no === seatNo ? { ...s, occupied: true, passenger_id: passengerId } : s)))
  }

  const handleCheckIn = (passengerId: number) => {
    setCheckInPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, checked_in: true } : p)))
  }

  const handleCheckOut = (passengerId: number) => {
    const seatNo = checkInPassengers.find((p) => p.id === passengerId)?.seat_no
    setCheckInPassengers((prev) => prev.map((p) => (p.id === passengerId ? { ...p, checked_in: false, seat_no: null } : p)))
    if (seatNo) setSeatMap((prev) => prev.map((s) => (s.seat_no === seatNo ? { ...s, occupied: false, passenger_id: undefined } : s)))
  }

  const handleUpdatePassengerInFlight = (updated: PassengerInFlightRow) => {
    setInFlightPassengers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
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

      <Modal isOpen={showCheckInModal} title={`Check-in Service - ${selectedFlight?.name} (${selectedFlight?.id})`} onClose={() => setShowCheckInModal(false)} className="max-w-6xl w-full">
        <CheckInPanel
          passengers={checkInPassengers}
          seats={seatMap}
          onAssignSeat={handleAssignSeat}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      </Modal>

      <Modal isOpen={showInFlightModal} title={`In-Flight Service - ${selectedFlight?.name} (${selectedFlight?.id})`} onClose={() => setShowInFlightModal(false)} className="max-w-6xl w-full">
        <InFlightPanel passengers={inFlightPassengers} services={flightServices} onUpdatePassenger={handleUpdatePassengerInFlight} />
      </Modal>
    </div>
  )
}

export default StaffDashboard



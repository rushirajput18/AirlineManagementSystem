git import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import AssignedFlightsTable from './components/AssignedFlightsTable'
import CheckInPanel from './components/CheckInPanel'
import InFlightPanel from './components/InFlightPanel'
import { AssignedFlightRow, UserData, PassengerCheckInRow, SeatCell, PassengerInFlightRow, FlightServiceItem, BackendFlight } from '../../types'

const StaffDashboard: React.FC = () => {
  const [userData, setUserData] = useState<string | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<AssignedFlightRow | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showInFlightModal, setShowInFlightModal] = useState(false)
  const [checkInPassengers, setCheckInPassengers] = useState<PassengerCheckInRow[]>([])
  const [seatMap, setSeatMap] = useState<SeatCell[]>([])
  const [inFlightPassengers, setInFlightPassengers] = useState<PassengerInFlightRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [flightServices, setFlightServices] = useState<FlightServiceItem[]>([ 
    { id: 1, category: 'ancillary', name: 'Extra Baggage', price: 30 } as any,
    { id: 2, category: 'ancillary', name: 'Priority Boarding', price: 15 } as any,
    { id: 3, category: 'meal', name: 'Veg Meal', meal_type: 'veg', price: 10 } as any,
    { id: 4, category: 'meal', name: 'Chicken Meal', meal_type: 'non-veg', price: 12 } as any,
    { id: 5, category: 'shopping', name: 'Headphones', price: 25 } as any,
    { id: 6, category: 'shopping', name: 'Neck Pillow', price: 18 } as any,
  ])
  const [allFlights, setAllFlights] = useState<AssignedFlightRow[]>([]);

  const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_FLIGHT_SERVICE_URL; 

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const storedUserData = localStorage.getItem('userData')
    if (!token || userRole !== 'staff') {
      navigate('/login')
      return
    }
    if (storedUserData) setUserData(storedUserData)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    navigate('/login')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
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

  useEffect(() => {
    const fetchFlights = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${backendUrl}/staff/flights`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch flights: ${response.status}`);
        }

        const data: BackendFlight[] = await response.json();

        const mappedFlights: AssignedFlightRow[] = data.map((flight) => ({
          id: flight.flightId,
          name: flight.flightNumber,
          destination: flight.destination,
          departure: new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "Scheduled", // default or derived from other data
          checkInStatus: "Not Started", // default or derived
          passengers: 0, // placeholder unless provided
          checkedIn: 0, // placeholder unless provided
        }));

        setAllFlights(mappedFlights);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
  }, []);

  const assignedFlights = useMemo(() => {
    if (!searchQuery.trim()) return allFlights;

    const query = searchQuery.toLowerCase();
    return allFlights.filter(flight =>
      // flight.id.includes(query) ||
      flight.name.toLowerCase().includes(query) ||
      flight.destination?.toLowerCase().includes(query) ||
      flight.status.toLowerCase().includes(query)
    );
  }, [allFlights, searchQuery]);

  const fetchPassengers = async (flightId: number): Promise<PassengerCheckInRow[]> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${backendUrl}/staff/flights/${flightId}/passengers`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch passengers: ${response.status}`);
    }

    return await response.json();
  };

  const generateSeatMap = (passengers: PassengerCheckInRow[], totalSeats: number): SeatCell[] => {
    return Array.from({ length: totalSeats }).map((_, idx) => {
      const row = Math.floor(idx / 6) + 1;
      const col = String.fromCharCode(65 + (idx % 6));
      const seat_no = `${row}${col}`;
      const passenger = passengers.find(p => p.seatNumber === seat_no);
      return {
        seat_no,
        occupied: !!passenger,
        passenger_id: passenger?.passengerId,
      };
    });
  };


  const handleCheckInService = async (flight: AssignedFlightRow) => {
    setSelectedFlight(flight);
    
    try {
      const passengers = await fetchPassengers(flight.id);
      setCheckInPassengers(passengers);

      const seatMap = generateSeatMap(passengers, 36);
      setSeatMap(seatMap);

      setShowCheckInModal(true);
      alert(`Check-in service opened for Flight ${flight.name}. Found ${passengers.length} passengers.`);
    } catch (error) {
      console.error("Error during check-in service:", error);
      alert('Failed to load passenger data. Please try again.');
    }
  };


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
    alert(`In-flight service opened for Flight ${flight.name}. Ready to manage passenger services.`);
  }

  const handleAssignSeat = (passengerId: number, seatNo: string) => {
    setCheckInPassengers((prev) => prev.map((p) => (p.passengerId === passengerId ? { ...p, seat_no: seatNo } : p)))
    setSeatMap((prev) => prev.map((s) => (s.seat_no === seatNo ? { ...s, occupied: true, passenger_id: passengerId } : s)))
    alert(`Seat ${seatNo} has been assigned to passenger ${passengerId} successfully!`)
  }

  const handleCheckIn = (passengerId: number) => {
    setCheckInPassengers((prev) => prev.map((p) => (p.passengerId === passengerId ? { ...p, checked_in: true } : p)))
    alert(`Passenger ${passengerId} has been checked in successfully!`)
  }

  const handleCheckOut = (passengerId: number) => {
    const seatNo = checkInPassengers.find((p) => p.passengerId === passengerId)?.seatNumber
    setCheckInPassengers((prev) => prev.map((p) => (p.passengerId === passengerId ? { ...p, checked_in: false, seat_no: null } : p)))
    if (seatNo) setSeatMap((prev) => prev.map((s) => (s.seat_no === seatNo ? { ...s, occupied: false, passenger_id: undefined } : s)))
    alert(`Passenger ${passengerId} has been checked out successfully!`)
  }

  const handleUpdatePassengerInFlight = (updated: PassengerInFlightRow) => {
    setInFlightPassengers((prev) => prev.map((p) => (p.passengerId === updated.passengerId ? updated : p)))
  }

  // Calculate dynamic progress for each flight
  const getFlightProgress = (flight: AssignedFlightRow) => {
    if (flight.passengers === 0) return 0
    return Math.round((flight.checkedIn / flight.passengers) * 100)
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
      <NavBar 
        title="Airline Management System" 
        userName={userData} 
        onLogout={handleLogout}
        onSearch={handleSearch}
        showSearch={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here are your assigned flights and tasks.</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Assigned Flights</h3>
            <div className="text-sm text-gray-600">Total Flights: {assignedFlights.length}</div>
          </div>
          <AssignedFlightsTable flights={assignedFlights} onCheckIn={handleCheckInService} onInFlight={handleInFlightService} />
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
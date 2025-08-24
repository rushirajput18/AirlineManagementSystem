import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/common/NavBar'
import Card from '../../components/common/Card'
import Modal from '../../components/common/Modal'
import AssignedFlightsTable from './components/AssignedFlightsTable'
import CheckInPanel from './components/CheckInPanel'
import InFlightPanel from './components/InFlightPanel'
import { AssignedFlightRow, UserData, PassengerCheckInRow, SeatCell, PassengerInFlightRow, FlightServiceItem, BackendFlight } from '../../types'
import { clearAuthData } from '../../utils/auth'
import axios from 'axios'

const StaffDashboard: React.FC = () => {
  const [userData, setUserData] = useState<string | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<AssignedFlightRow | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showInFlightModal, setShowInFlightModal] = useState(false)
  const [checkInPassengers, setCheckInPassengers] = useState<PassengerCheckInRow[]>([])
  const [seatMap, setSeatMap] = useState<SeatCell[]>([])
  const [inFlightPassengers, setInFlightPassengers] = useState<PassengerInFlightRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [flightServices, setFlightServices] = useState<FlightServiceItem[]>([])

  useEffect(() => {
    // only fetch when a flight is selected and the In-Flight modal is open
    if (!selectedFlight?.id || !showInFlightModal) {
      setInFlightPassengers([])   // clear old data
      return
    }

    const loadPassengers = async () => {
      try {
        const rawData = await fetchPassengersInFlight(selectedFlight.id) // or call your API
        const mappedData: PassengerInFlightRow[] = rawData.map((p): PassengerInFlightRow => ({
        ...p,
        // meal_preference: p..toLowerCase().includes('veg')
        mealPreference: p.mealPreference,
        selected_ancillary_ids: [],
        selected_meal_id: undefined,
        selected_shopping_item_ids: [],
      }));

      setInFlightPassengers(mappedData)

      } catch (err) {
        console.error('Error loading in-flight passengers:', err)
        setInFlightPassengers([])
      }
    }

    loadPassengers()
  }, [selectedFlight, showInFlightModal])


  useEffect(() => {
    const fetchFlightServices = async () => {
      if (!selectedFlight?.id) return

      try {
        const token = localStorage.getItem('token') 
        
        const response = await axios.get<FlightServiceItem[]>(`${backendUrl}/staff/flight-services/flight/${selectedFlight?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const rawData = response.data

        // console.log(rawData)

      const mappedData = rawData.map((item: any) => {
        // Normalize category
        let category = ''
        switch (item.category.toLowerCase()) {
          case 'meals':
            category = 'meal'
            break
          case 'ancillary':
            category = 'ancillary'
            break
          case 'shopping':
            category = 'shopping'
            break
          default:
            category = 'other'
        }

        // Build mapped object
        const mappedItem: any = {
          id: item.serviceId,
          category,
          name: item.name,
          price: item.price
        }

        // Add meal_type if it's a meal
        if (category === 'meal') {
          mappedItem.meal_type = item.name.toLowerCase().includes('veg') ? 'veg' : 'non-veg'
        }

        return mappedItem
      })

      setFlightServices(mappedData)
    } catch (error) {
      console.error('Failed to fetch flight services:', error)
    }
  }

    fetchFlightServices()
  }, [selectedFlight])

  const [allFlights, setAllFlights] = useState<AssignedFlightRow[]>([]);

  const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_FLIGHT_SERVICE_URL; 

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    const storedUserData = localStorage.getItem('userData')
    if (userRole !== 'staff') {
      navigate('/login')
      return
    }
    if (storedUserData) setUserData(storedUserData)
  }, [navigate])

  const handleLogout = () => {
    clearAuthData()
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

  const fetchPassengersInFlight = async (flightId: number): Promise<PassengerInFlightRow[]> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${backendUrl}/staff/flights/${flightId}/inflight/passengers`, {
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
      // alert(`Check-in service opened for Flight ${flight.name}. Found ${passengers.length} passengers.`);
    } catch (error) {
      console.error("Error during check-in service:", error);
      alert('Failed to load passenger data. Please try again.');
    }
  };


  const handleInFlightService = (flight: AssignedFlightRow) => {
    setSelectedFlight(flight)
    setShowInFlightModal(true)
  }


  const handleAssignSeat = (passengerId: number, seatNo: string) => {
    console.log(`Assigning seat ${seatNo} to passenger ${passengerId}`)
    
    // First, clear any existing seat assignment for this passenger
    const currentPassenger = checkInPassengers.find(p => p.passengerId === passengerId)
    if (currentPassenger?.seatNumber) {
      console.log(`Clearing existing seat ${currentPassenger.seatNumber} for passenger ${passengerId}`)
      setSeatMap((prev) => prev.map((s) => 
        s.seat_no === currentPassenger.seatNumber 
          ? { ...s, occupied: false, passenger_id: undefined } 
          : s
      ))
    }

    // Check if the seat is already assigned to another passenger
    const seatAlreadyAssigned = checkInPassengers.some(p => 
      p.passengerId !== passengerId && p.seatNumber === seatNo
    )
    
    if (seatAlreadyAssigned) {
      console.warn(`Seat ${seatNo} is already assigned to another passenger`)
      alert(`Seat ${seatNo} is already assigned to another passenger. Please select a different seat.`)
      return
    }

    // Update passenger with new seat assignment
    setCheckInPassengers((prev) => prev.map((p) => 
      p.passengerId === passengerId 
        ? { ...p, seatNumber: seatNo } 
        : p
    ))
    
    // Update seat map to mark seat as occupied
    setSeatMap((prev) => prev.map((s) => 
      s.seat_no === seatNo 
        ? { ...s, occupied: true, passenger_id: passengerId } 
        : s
    ))
    
    console.log(`Successfully assigned seat ${seatNo} to passenger ${passengerId}`)
    // alert(`Seat ${seatNo} has been assigned to passenger ${passengerId} successfully!`)
  }

  const handleCheckIn = (passengerId: number) => {
    const passenger = checkInPassengers.find(p => p.passengerId === passengerId)
    console.log(passenger)
    if (!passenger?.seatNumber) {
      alert('Please assign a seat before checking in the passenger.')
      return
    }
    
    console.log(`Checking in passenger ${passengerId} with seat ${passenger.seatNumber}`)
    setCheckInPassengers((prev) => prev.map((p) => 
      p.passengerId === passengerId 
        ? { ...p, checkedIn: true } 
        : p
    ))
    
  }

  const handleCheckOut = (passengerId: number) => {
    const passenger = checkInPassengers.find(p => p.passengerId === passengerId)
    if (!passenger) {
      console.error(`Passenger ${passengerId} not found`)
      return
    }
    
    console.log(`Checking out passenger ${passengerId} from seat ${passenger.seatNumber}`)
    
    // Clear seat assignment and check-in status
    setCheckInPassengers((prev) => prev.map((p) => 
      p.passengerId === passengerId 
        ? { ...p, checkedIn: false, seatNumber: null } 
        : p
    ))
    
    // Clear seat from seat map if passenger had a seat assigned
    if (passenger.seatNumber) {
      setSeatMap((prev) => prev.map((s) => 
        s.seat_no === passenger.seatNumber 
          ? { ...s, occupied: false, passenger_id: undefined } 
          : s
      ))
    }
    
    alert(`Passenger ${passengerId} has been checked out successfully!`)
  }

  
const handleUpdatePassengerInFlight = async (updated: PassengerInFlightRow) => {
  const token = localStorage.getItem('token')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const { passengerId, selected_ancillary_ids, selected_meal_id, mealPreference, selected_shopping_item_ids } = updated

  try {
    // 🧳 Ancillaries
    if (selected_ancillary_ids && selected_ancillary_ids.length > 0) {
      await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/ancillaries`, {
        selectedAncillaries: selected_ancillary_ids
      }, { headers })
    }

    // 🍽️ Meal Preference
    if (selected_meal_id !== undefined) {
      await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/meals/preference`, {
        mealPreference: selected_meal_id
      }, { headers })
    }

    // 🛍️ Shopping Items
    if (selected_shopping_item_ids && selected_shopping_item_ids.length > 0) {
      await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/shopping`, {
        shoppingItems: selected_shopping_item_ids.map(id => String(id))

      }, { headers })
    }
    
    if(selected_meal_id === undefined && (!selected_shopping_item_ids || selected_shopping_item_ids.length == 0) && (!selected_ancillary_ids || selected_ancillary_ids.length == 0)){
      await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/ancillaries`, { headers });

      // 🍽️ Delete meal preference
      await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/meals/preference`, { headers });

      // 🛍️ Delete shopping items
      await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/shopping`, { headers });
    }

    // ✈️ Update local state
    setInFlightPassengers(prev =>
      prev.map(p => (p.passengerId === passengerId ? updated : p))
    )
  } catch (error) {
    console.error('Error updating passenger inflight data:', error)
  }
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
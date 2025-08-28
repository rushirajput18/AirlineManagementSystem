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
  const [allFlights, setAllFlights] = useState<AssignedFlightRow[]>([]);
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
      setInFlightPassengers([])// clear old data
      return
    }

    const loadPassengers = async () => {
      try {
        const rawData = await fetchPassengersInFlight(selectedFlight.id) // or call your API
        const mappedData: PassengerInFlightRow[] = rawData.map((p): PassengerInFlightRow => {
          return {
            ...p,
            mealPreference: p.mealPreference,
          };
        });

        setInFlightPassengers(mappedData);
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
    console.log("called inside handleLogout line 132")
    navigate('/login')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const fetchFlights = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const flightResponse = await fetch(`${backendUrl}/staff/flights`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!flightResponse.ok) {
        throw new Error(`Failed to fetch flights: ${flightResponse.status}`);
      }

      const flightData = await flightResponse.json();

      const mappedFlights: AssignedFlightRow[] = await Promise.all(
        flightData.map(async (flight: { flightId: any; flightNumber: any; destination: any; departureTime: string | number | Date }) => {
          try {
            const passengerResponse = await fetch(
              `${backendUrl}/staff/flights/${flight.flightId}/passengers`,
              {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!passengerResponse.ok) {
              throw new Error(`Failed to fetch passengers for flight ${flight.flightId}`);
            }

            const passengers = await passengerResponse.json();
            const totalPassengers = passengers.length;
            const checkedInCount = passengers.filter((p: { isCheckedIn: any }) => p.isCheckedIn).length;

            return {
              id: flight.flightId,
              name: flight.flightNumber,
              destination: flight.destination,
              departure: new Date(flight.departureTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: "Scheduled",
              checkInStatus: checkedInCount === 0
                ? "Not Started"
                : checkedInCount === totalPassengers
                  ? "Completed"
                  : "In Progress",
              passengers: totalPassengers,
              checkedIn: checkedInCount,
            };
          } catch (err) {
            console.error(`Error fetching passengers for flight ${flight.flightId}:`, err);
            return {
              id: flight.flightId,
              name: flight.flightNumber,
              destination: flight.destination,
              departure: new Date(flight.departureTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: "Scheduled",
              checkInStatus: "Unknown",
              passengers: 0,
              checkedIn: 0,
            };
          }
        })
      );

      setAllFlights(mappedFlights);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []); // Empty dependency array ensures this runs only on mount


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
      // console.log(passengers)

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

  const handleCheckIn = async (passengerId: number) => {
    const passenger = checkInPassengers.find(p => p.passengerId === passengerId);

    if (!passenger?.seatNumber) {
      alert('Please assign a seat before checking in the passenger.');
      return;
    }

    if (!selectedFlight?.id) {
      alert('No flight selected.');
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      passengerId: passenger.passengerId,
      seatNumber: passenger.seatNumber,
      flightId: selectedFlight.id,
    };

    try {
      // Step 1: Delete any existing seat assignment
      const deleteResponse = await fetch(
        `${backendUrl}/staff/delete?passengerId=${passenger.passengerId}&flightId=${selectedFlight.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteResponse.ok) {
        console.warn(`No existing seat assignment to delete or deletion failed: ${deleteResponse.status}`);
      }

      // Step 2: Assign the new seat
      const assignSeatResponse = await fetch(`${backendUrl}/staff/passengers/assign-seat`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!assignSeatResponse.ok) {
        throw new Error(`Seat assignment failed: ${assignSeatResponse.status}`);
      }

      // Step 3: Check in the passenger
      const checkInResponse = await fetch(
        `${backendUrl}/staff/flights/${selectedFlight.id}/passengers/${passengerId}/checkin`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkInResponse.ok) {
        throw new Error(`Check-in failed: ${checkInResponse.status}`);
      }

      // Step 4: Update local state
      setCheckInPassengers((prev) =>
        prev.map((p) =>
          p.passengerId === passengerId
            ? { ...p, isCheckedIn: true }
            : p
        )
      );

      await fetchFlights();


      console.log(`Passenger ${passengerId} checked in successfully.`);
    } catch (error) {
      console.error("Error during check-in:", error);
      alert("Failed to check in passenger. Please try again.");
    }
  };


  const handleCheckOut = async (passengerId: number) => {
    const passenger = checkInPassengers.find(p => p.passengerId === passengerId);

    if (!passenger) {
      console.error(`Passenger ${passengerId} not found`);
      return;
    }

    if (!selectedFlight?.id) {
      alert('No flight selected.');
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${backendUrl}/staff/flights/${selectedFlight.id}/passengers/${passengerId}/checkout`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.status}`);
      }

      await fetchFlights();

      console.log(`Checking out passenger ${passengerId} from seat ${passenger.seatNumber}`);

      // Clear seat assignment and check-in status
      setCheckInPassengers((prev) =>
        prev.map(
          (p) =>
            p.passengerId === passengerId
              ? { ...p, isCheckedIn: false, seatNumber: null }
              : p
        )
      );

      // Clear seat from seat map if passenger had a seat assigned
      if (passenger.seatNumber) {
        setSeatMap((prev) =>
          prev.map((s) =>
            s.seat_no === passenger.seatNumber
              ? { ...s, occupied: false, passenger_id: undefined }
              : s
          )
        );
      }

      alert(`Passenger ${passengerId} has been checked out successfully!`);
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to check out passenger. Please try again.");
    }
  };

  const handleUpdatePassengerInFlight = async (updated: PassengerInFlightRow) => {
    const token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    const { passengerId, selectedAncillaryIds, selectedMealId, selectedShoppingItemIds } = updated
    // console.log(typeof(selectedMealId))
    // console.log(selectedMealId)
    try {

      // 🧳 Ancillaries
      if (selectedAncillaryIds && selectedAncillaryIds.length > 0) {
        await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/ancillaries`, { headers });

        await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/ancillaries`, {
          selectedAncillaries: selectedAncillaryIds
        }, { headers })
      }

      // 🍽️ Meal Preference
      if (selectedMealId !== undefined) {
        await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/meals/preference`, { headers });

        await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/meals/preference`, {
          mealPreference: selectedMealId
        }, { headers })
      }

      // 🛍️ Shopping Items
      if (selectedShoppingItemIds && selectedShoppingItemIds.length > 0) {
        await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/shopping`, { headers });

        await axios.post(`${backendUrl}/staff/passengers/${passengerId}/inflight/shopping`, {
          shoppingItems: selectedShoppingItemIds.map((id: any) => String(id))
        }, { headers })
      }

      if ((!selectedAncillaryIds || selectedAncillaryIds.length == 0)) {
        await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/ancillaries`, { headers });
      }

      if (selectedMealId === undefined) {
        // 🍽️ Delete meal preference
        await axios.delete(`${backendUrl}/staff/passengers/${passengerId}/inflight/meals/preference`, { headers });
      }

      if ((!selectedShoppingItemIds || selectedShoppingItemIds.length == 0)) {
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
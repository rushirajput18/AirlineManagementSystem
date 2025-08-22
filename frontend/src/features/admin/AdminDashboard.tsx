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
import { FlightRow, NewFlight, NewPassenger, PassengerRow, UserData, PassengerFilters, FlightServiceItem, NewServiceItem, Flight } from '../../types'
import { clearAuthData } from '../../utils/auth'

const AdminDashboard: React.FC = () => {
  const [userData, setUserData] = useState<string | null>(null)
  const [flightId, setFlightId] = useState<number | null>(null)
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
  const [searchQuery, setSearchQuery] = useState('')
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
  const [showEditFlightModal, setShowEditFlightModal] = useState(false)
  const [flightToEdit, setFlightToEdit] = useState<FlightRow | null>(null)
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_FLIGHT_SERVICE_URL;

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    const storedUserData = localStorage.getItem('userData')
    if (userRole !== 'admin') {
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

  const [allFlights, setAllFlights] = useState<FlightRow[]>([])

  async function fetchFlights(): Promise<FlightRow[]> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${backendUrl}/admin/flights`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: Flight[] = await response.json();

  const mappedFlights: FlightRow[] = data.map(flight => ({
    id: flight.flightId,
    flight_number: flight.flightNumber,
    flight_route: `${flight.origin ?? 'Unknown'} to ${flight.destination ?? 'Unknown'}`,
    departure_time: flight.departureTime.replace("T", " "),
    arrival_time: flight.arrivalTime.replace("T", " ")
  }));

  return mappedFlights;
}
  

  useEffect(() => {
    fetchFlights()
      .then(mappedFlights => {
        setAllFlights(mappedFlights);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
  
  const flights = useMemo(() => {
    if (!searchQuery.trim()) return allFlights
    
    const query = searchQuery.toLowerCase()
    return allFlights.filter(flight => 
      flight.flight_number.toLowerCase().includes(query) ||
      flight.flight_route.toLowerCase().includes(query) ||
      flight.id.toString().includes(query)
    )
  }, [allFlights, searchQuery])

  const handlePassengerManagement = (flight: FlightRow) => {
    setSelectedFlight(flight)
    setFlightId(flight.id)
    setShowPassengerModal(true)
  }

  const handleEditFlight = (flight: FlightRow) => {
    setFlightToEdit(flight)
    const route = flight.flight_route || ''
    let departure = ''
    let destination = ''
    const byTo = route.split(' to ')
    if (byTo.length === 2) {
      departure = byTo[0].trim()
      destination = byTo[1].trim()
    } else {
      const byDash = route.split('-')
      if (byDash.length === 2) {
        departure = byDash[0].trim()
        destination = byDash[1].trim()
      } else {
        const byArrow = route.split('->')
        if (byArrow.length === 2) {
          departure = byArrow[0].trim()
          destination = byArrow[1].trim()
        }
      }
    }
    setNewFlight({
      flight_number: flight.flight_number,
      flight_route: flight.flight_route,
      departure,
      destination,
      departure_time: (flight.departure_time || '').replace(' ', 'T'),
      arrival_time: (flight.arrival_time || '').replace(' ', 'T'),
    })
    setShowEditFlightModal(true)
  }

  const handleDeleteFlight = async (flight: FlightRow) => {
    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch(`${backendUrl}/admin/flights/${flight.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete flight: ${response.statusText}`);
      }

      // Update local state only after successful deletion
      setAllFlights(prev => prev.filter(f => f.id !== flight.id));
      alert(`Flight ${flight.flight_number} has been deleted successfully!`);
    } catch (error) {
      console.error("Error deleting flight:", error);
      alert("Failed to delete flight. Please try again.");
    }
  };


  const handleViewPassengers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/admin/passengers/flight/${flightId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Replace with your actual token
        }
      });

      const flightData = await response.json();

      const mappedPassengers: PassengerRow[] = flightData.map((passenger: any) => ({
        id: passenger.passengerId,
        name: passenger.name,
        date_of_birth: passenger.dateOfBirth,
        passport: passenger.passport,
        meal_preference: passenger.mealPreference.toLowerCase().includes('non') ? 'non-veg' : 'veg',
        need_wheelchair: passenger.needsWheelchair,
        travelling_with_infant: passenger.travellingWithInfant,
        address: passenger.address || '',
      }));

      setPassengers(mappedPassengers);
    } catch (error) {
      console.error('Failed to fetch passenger data:', error);
    }
  };


  const handleNewPassengerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = localStorage.getItem('token');
    if (!token) {
      //alert('No token found in localStorage');
      return;
    }

    const requestBody = {
      flightId: flightId,    // Same here—ensure it's the correct flight
      name: newPassenger.name,
      dateOfBirth: newPassenger.date_of_birth,
      passport: newPassenger.passport,
      address: newPassenger.address,
      mealPreference: newPassenger.meal_preference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian',
      needsWheelchair: newPassenger.need_wheelchair,
      travellingWithInfant: newPassenger.travelling_with_infant
    };

    
    try {
      const response = await fetch(`${backendUrl}/admin/passengers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      await response.json();
      //alert(`Passenger ${newPassenger.name} has been added successfully!`)
    } catch (error) {
      console.error('Error adding passenger:', error);
      //alert('Failed to add passenger. Please try again.')
    }

    setShowNewPassengerModal(false)
    setNewPassenger({ name: '', date_of_birth: '', passport: '', address: '', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false })
  }

  const handleNewFlightSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const composedRoute = (newFlight.departure || newFlight.destination)
      ? `${newFlight.departure || ''} to ${newFlight.destination || ''}`.trim()
      : newFlight.flight_route;

    const route = composedRoute || '';
    
    const toAdd: FlightRow = {
      id: 0,
      flight_number: newFlight.flight_number,
      flight_route: route,
      departure_time: newFlight.departure_time,
      arrival_time: newFlight.arrival_time,
    };

    const requestBody = {
      flightNumber: toAdd.flight_number,
      origin: newFlight.departure, // You can replace this with newFlight.departure if needed
      destination: newFlight.destination, // Or use newFlight.destination
      departureTime: toAdd.departure_time,
      arrivalTime: toAdd.arrival_time,
    };

    console.log(requestBody)

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/admin/flights`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to add flight: ${response.status}`);
      }

      // Optionally update local state after successful POST
      setAllFlights((prev) => [...prev, toAdd]);
      setShowNewFlightModal(false);
      setNewFlight({
        flight_number: '',
        flight_route: '',
        departure_time: '',
        arrival_time: '',
        departure: '',
        destination: '',
      });

      //alert(`Flight ${toAdd.flight_number} has been added successfully!`);
    } catch (error) {
      console.error("Error adding flight:", error);
      //alert("Failed to add flight. Please try again.");
    }
  };

  const handleEditFlightSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!flightToEdit) return;

  const composedRoute = (newFlight.departure || newFlight.destination)
    ? `${newFlight.departure || ''} to ${newFlight.destination || ''}`.trim()
    : newFlight.flight_route;

  const route = composedRoute || '';

  const updatedFlight: FlightRow = {
    ...flightToEdit,
    flight_number: newFlight.flight_number || flightToEdit.flight_number,
    flight_route: route || flightToEdit.flight_route,
    departure_time: (newFlight.departure_time || flightToEdit.departure_time).replace('T', ' '),
    arrival_time: (newFlight.arrival_time || flightToEdit.arrival_time).replace('T', ' '),
  };

  const requestBody = {
    flightId: updatedFlight.id,
    flightNumber: updatedFlight.flight_number,
    origin: newFlight.departure || null,
    destination: newFlight.destination || null,
    departureTime: newFlight.departure_time || flightToEdit.departure_time,
    arrivalTime: newFlight.arrival_time || flightToEdit.arrival_time,
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${backendUrl}/admin/flights/${updatedFlight.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to update flight: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Flight updated:", result);

    setAllFlights((prev) =>
      prev.map((f) => (f.id === flightToEdit.id ? updatedFlight : f))
    );
    setShowEditFlightModal(false);
    setFlightToEdit(null);
    setNewFlight({
      flight_number: '',
      flight_route: '',
      departure_time: '',
      arrival_time: '',
      departure: '',
      destination: '',
    });

    alert(`Flight ${updatedFlight.flight_number} has been updated successfully!`);
  } catch (error) {
    console.error("Error updating flight:", error);
    alert("Failed to update flight. Please try again.");
  }
};


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

  const handlePassengerRemove = async (p: PassengerRow) => {
    setPassengers((prev) => prev.filter((x) => x.id !== p.id));

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/admin/passengers/${p.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete passenger. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting passenger:', error);
    }
  };

  const handlePassengerEditSave = async (updated: PassengerRow) => {
    setPassengers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    setShowPassengerEditModal(false);
    setPassengerToEdit(null);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const body = {
      passengerId: updated.id,
      flightId: flightId,
      name: updated.name,
      dateOfBirth: updated.date_of_birth ?? null,
      passport: updated.passport ?? null,
      address: updated.address ?? null,
      mealPreference: updated.meal_preference,
      needsWheelchair: updated.need_wheelchair,
      travellingWithInfant: updated.travelling_with_infant,
    };

    try {
      const response = await fetch(`${backendUrl}/admin/passengers/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      
      if (!response.ok) {
        throw new Error(`Failed to update passenger. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating passenger:', error);
      // Optionally show error UI or revert optimistic update
    }
  };

  const handleOpenServices = async (flight: FlightRow) => {
    setServiceFlight(flight);
    const token = localStorage.getItem("token");

    if (!services[flight.id]) {
      try {
        const response = await fetch(`${backendUrl}/admin/flight-services/flight/${flight.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Replace with your actual token
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }

        const backendData = await response.json();

        const mappedServices = backendData.map((service: { serviceId: any; category: string; name: any; price: any }) => ({
          id: service.serviceId,
          category: service.category.toLowerCase(),
          name: service.name,
          price: service.price,
        }));

        setServices((prev) => ({
          ...prev,
          [flight.id]: mappedServices,
        }));
      } catch (error) {
        console.error('Error fetching services:', error);
        // Optionally show a toast or fallback UI
      }
    }

    setShowServiceModal(true);
  };

  const handleAddService = async (flightId: number, item: NewServiceItem) => {
    const accessToken = localStorage.getItem("token"); 
    const requestBody = {
      flightId: flightId,
      category: item.category,
      name: item.name,
      type: "In flight service", 
      price: parseFloat(item.price.toString()),
    };

    try {
      const response = await fetch(`${backendUrl}/admin/flight-services`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to add service: ${response.status}`);
      }

      const createdService = await response.json();
      
      setServices((prev) => {
        const list = prev[flightId] || [];
        return {
          ...prev,
          [flightId]: [...list, {
            id: createdService.serviceId, // assuming backend returns serviceId
            category: createdService.category.toLowerCase(),
            name: createdService.name,
            price: createdService.price,
            serviceId: createdService.serviceId
          }],
        };
      });
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleUpdateService = async (flightId: number, updated: FlightServiceItem) => {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token source

      const payload = {
        serviceId: updated.id || updated.serviceId,
        flightId: flightId,
        category: updated.category,
        name: updated.name,
        type: "In flight service",
        price: updated.price,
      };

      const response = await fetch(`${backendUrl}/admin/flight-services`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update service: ${response.statusText}`);
      }

      const updatedService = await response.json();

      setServices((prev) => ({
        ...prev,
        [flightId]: (prev[flightId] || []).map((s) =>
          s.id === updatedService.serviceId ? updatedService : s
        ),
      }));

    } catch (error) {
      console.error('Error updating service:', error);
    }
  };


  const handleDeleteService = async (flightId: number, serviceId: number) => {
    const accessToken = localStorage.getItem("token"); 
    try {
      const response = await fetch(`${backendUrl}/admin/flight-services/${serviceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.status}`);
      }

      setServices((prev) => ({
        ...prev,
        [flightId]: (prev[flightId] || []).filter((s) => s.id !== serviceId),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

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
      <NavBar 
        title="Airline Management System" 
        userName={userData} 
        onLogout={handleLogout}
        onSearch={handleSearch}
        showSearch={true}
      />
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
          <FlightTable 
            flights={flights} 
            onManagePassengers={handlePassengerManagement} 
            onManageServices={handleOpenServices}
            onEditFlight={handleEditFlight}
            onDeleteFlight={handleDeleteFlight}
            formatDateTime={formatDateTime} 
          />
        </Card>
      </div>

      <Modal isOpen={showPassengerModal} title={`Passenger Management - ${selectedFlight?.flight_number} (${selectedFlight?.id})`} onClose={() => setShowPassengerModal(false)} className="max-w-5xl w-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Manage passengers for this flight</p>
            <div className="flex space-x-2">
              <button onClick={() => setShowNewPassengerModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add New Passenger</button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleViewPassengers} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              View All Passengers
            </button>
          </div>
          
          {/* Passenger filters moved inside Manage Passengers modal */}
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
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
          
          <PassengerListTable passengers={filteredPassengers} onEdit={handlePassengerEditClick} onRemove={handlePassengerRemove} />
        </div>
      </Modal>

      <Modal isOpen={showNewPassengerModal} title="Add New Passenger" onClose={() => setShowNewPassengerModal(false)} className="max-w-2xl w-full">
        <NewPassengerForm form={newPassenger} onChange={handlePassengerChange} onSubmit={handleNewPassengerSubmit} />
      </Modal>

      <Modal isOpen={showNewFlightModal} title="Add New Flight" onClose={() => setShowNewFlightModal(false)} className="max-w-2xl w-full">
        <NewFlightForm form={newFlight} onChange={handleFlightChange} onSubmit={handleNewFlightSubmit} />
      </Modal>

      <Modal isOpen={showEditFlightModal} title="Edit Flight" onClose={() => setShowEditFlightModal(false)} className="max-w-2xl w-full">
        <NewFlightForm 
          form={newFlight}
          onChange={handleFlightChange} 
          onSubmit={handleEditFlightSubmit} 
          submitLabel="Save Changes"
        />
      </Modal>

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



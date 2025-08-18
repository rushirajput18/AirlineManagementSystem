import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showNewPassengerModal, setShowNewPassengerModal] = useState(false);
  const [showNewFlightModal, setShowNewFlightModal] = useState(false);
  const [showPassengerListModal, setShowPassengerListModal] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    name: '',
    date_of_birth: '',
    passport: '',
    address: '',
    meal_preference: 'veg',
    need_wheelchair: false,
    travelling_with_infant: false
  });
  const [newFlight, setNewFlight] = useState({
    flight_number: '',
    flight_route: '',
    departure_time: '',
    arrival_time: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserData = localStorage.getItem('userData');

    if (!token || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Sample flight data
  const flights = [
    { id: 101, flight_number: 'AA101', flight_route: 'New York to Los Angeles', departure_time: '2024-01-15 09:00:00', arrival_time: '2024-01-15 12:30:00' },
    { id: 102, flight_number: 'AA102', flight_route: 'Chicago to Miami', departure_time: '2024-01-15 11:30:00', arrival_time: '2024-01-15 15:45:00' },
    { id: 103, flight_number: 'AA103', flight_route: 'Seattle to Denver', departure_time: '2024-01-15 14:15:00', arrival_time: '2024-01-15 17:30:00' },
    { id: 104, flight_number: 'AA104', flight_route: 'Boston to San Francisco', departure_time: '2024-01-15 16:45:00', arrival_time: '2024-01-15 20:15:00' }
  ];

  const handlePassengerManagement = (flight) => {
    setSelectedFlight(flight);
    setShowPassengerModal(true);
  };

  const handleAddNewPassenger = () => {
    setShowNewPassengerModal(true);
  };

  const handleAddNewFlight = () => {
    setShowNewFlightModal(true);
  };

  const handleViewPassengers = () => {
    // Simulate loading passengers for the selected flight
    const mockPassengers = [
      { id: 1, name: 'John Doe', date_of_birth: '1990-05-15', passport: 'A12345678', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: false },
      { id: 2, name: 'Jane Smith', date_of_birth: '1985-08-22', passport: 'B87654321', meal_preference: 'non-veg', need_wheelchair: true, travelling_with_infant: false },
      { id: 3, name: 'Mike Johnson', date_of_birth: '1992-12-10', passport: 'C11223344', meal_preference: 'veg', need_wheelchair: false, travelling_with_infant: true }
    ];
    setPassengers(mockPassengers);
    setShowPassengerListModal(true);
  };

  const handleNewPassengerSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to add the passenger
    console.log('Adding new passenger:', newPassenger);
    setShowNewPassengerModal(false);
    setNewPassenger({
      name: '',
      date_of_birth: '',
      passport: '',
      address: '',
      meal_preference: 'veg',
      need_wheelchair: false,
      travelling_with_infant: false
    });
  };

  const handleNewFlightSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to add the flight
    console.log('Adding new flight:', newFlight);
    setShowNewFlightModal(false);
    setNewFlight({
      flight_number: '',
      flight_route: '',
      departure_time: '',
      arrival_time: ''
    });
  };

  const handlePassengerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPassenger(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setNewFlight(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Airline Management System</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {userData.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your airline operations efficiently.</p>
        </div>

        {/* Flight Management Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Flight Management</h3>
            <button 
              onClick={handleAddNewFlight}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all"
            >
              Add New Flight
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{flight.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{flight.flight_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{flight.flight_route}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(flight.departure_time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePassengerManagement(flight)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Manage Passengers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Passenger Management Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Passenger Management - {selectedFlight?.flight_number} ({selectedFlight?.id})
              </h3>
              <button
                onClick={() => setShowPassengerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Manage passengers for this flight</p>
                <button 
                  onClick={handleAddNewPassenger}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Add New Passenger
                </button>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={handleViewPassengers}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  View All Passengers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Passenger Modal */}
      {showNewPassengerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Passenger
              </h3>
              <button
                onClick={() => setShowNewPassengerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleNewPassengerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPassenger.name}
                    onChange={handlePassengerChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={newPassenger.date_of_birth}
                    onChange={handlePassengerChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                  <input
                    type="text"
                    name="passport"
                    value={newPassenger.passport}
                    onChange={handlePassengerChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
                  <select
                    name="meal_preference"
                    value={newPassenger.meal_preference}
                    onChange={handlePassengerChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={newPassenger.address}
                  onChange={handlePassengerChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="need_wheelchair"
                    checked={newPassenger.need_wheelchair}
                    onChange={handlePassengerChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Need Wheelchair</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="travelling_with_infant"
                    checked={newPassenger.travelling_with_infant}
                    onChange={handlePassengerChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Travelling with Infant</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPassengerModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Passenger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Flight Modal */}
      {showNewFlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Flight
              </h3>
              <button
                onClick={() => setShowNewFlightModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleNewFlightSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    name="flight_number"
                    value={newFlight.flight_number}
                    onChange={handleFlightChange}
                    required
                    placeholder="e.g., AA101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Route</label>
                  <input
                    type="text"
                    name="flight_route"
                    value={newFlight.flight_route}
                    onChange={handleFlightChange}
                    required
                    placeholder="e.g., New York to Los Angeles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    name="departure_time"
                    value={newFlight.departure_time}
                    onChange={handleFlightChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    value={newFlight.arrival_time}
                    onChange={handleFlightChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewFlightModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Passenger List Modal */}
      {showPassengerListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Passengers - {selectedFlight?.flight_number} ({selectedFlight?.id})
              </h3>
              <button
                onClick={() => setShowPassengerListModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Preference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Needs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passengers.map((passenger) => (
                    <tr key={passenger.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{passenger.date_of_birth}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{passenger.passport}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          passenger.meal_preference === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {passenger.meal_preference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {passenger.need_wheelchair && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">Wheelchair</span>}
                          {passenger.travelling_with_infant && <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Infant</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

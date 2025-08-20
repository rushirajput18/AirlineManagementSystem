import React from 'react'
import { AssignedFlightRow } from '../../../types'

interface AssignedFlightsTableProps {
  flights: AssignedFlightRow[]
  onCheckIn: (flight: AssignedFlightRow) => void
  onInFlight: (flight: AssignedFlightRow) => void
}

const AssignedFlightsTable: React.FC<AssignedFlightsTableProps> = ({ flights, onCheckIn, onInFlight }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Progress</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {flights.map((flight) => (
          <tr key={flight.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{flight.id}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{flight.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{flight.destination}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{flight.departure}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(flight.checkedIn / flight.passengers) * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-600">{flight.checkedIn}/{flight.passengers}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button onClick={() => onCheckIn(flight)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors">Check-in</button>
                <button onClick={() => onInFlight(flight)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors">In-Flight</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default AssignedFlightsTable



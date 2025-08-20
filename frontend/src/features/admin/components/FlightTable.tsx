import React from 'react'
import { FlightRow } from '../../../types'

interface FlightTableProps {
  flights: FlightRow[]
  onManagePassengers: (flight: FlightRow) => void
  onManageServices?: (flight: FlightRow) => void
  formatDateTime: (s: string) => string
}

const FlightTable: React.FC<FlightTableProps> = ({ flights, onManagePassengers, onManageServices, formatDateTime }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Number</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Time</th>
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
              <div className="text-sm text-gray-900">{flight.flight_number}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{(() => {
                const route = flight.flight_route || ''
                const byTo = route.split(' to ')
                if (byTo.length === 2) return byTo[0].trim()
                const byDash = route.split('-')
                if (byDash.length === 2) return byDash[0].trim()
                const byArrow = route.split('->')
                if (byArrow.length === 2) return byArrow[0].trim()
                return route
              })()}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{(() => {
                const route = flight.flight_route || ''
                const byTo = route.split(' to ')
                if (byTo.length === 2) return byTo[1].trim()
                const byDash = route.split('-')
                if (byDash.length === 2) return byDash[1].trim()
                const byArrow = route.split('->')
                if (byArrow.length === 2) return byArrow[1].trim()
                return ''
              })()}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{formatDateTime(flight.departure_time)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button onClick={() => onManagePassengers(flight)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors">Manage Passengers</button>
                {onManageServices && (
                  <button onClick={() => onManageServices(flight)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs transition-colors">Manage Services</button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default FlightTable



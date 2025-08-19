import React from 'react'
import { PassengerRow } from '../../../types'

interface PassengerListTableProps {
  passengers: PassengerRow[]
  onEdit: (p: PassengerRow) => void
  onRemove: (p: PassengerRow) => void
}

const PassengerListTable: React.FC<PassengerListTableProps> = ({ passengers, onEdit, onRemove }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
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
              <div className="text-sm text-gray-900">{passenger.address || '-'}</div>
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
                {passenger.need_wheelchair && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">Wheelchair</span>
                )}
                {passenger.travelling_with_infant && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Infant</span>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button onClick={() => onEdit(passenger)} className="text-blue-600 hover:text-blue-900">Edit</button>
                <button onClick={() => onRemove(passenger)} className="text-red-600 hover:text-red-900">Remove</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default PassengerListTable



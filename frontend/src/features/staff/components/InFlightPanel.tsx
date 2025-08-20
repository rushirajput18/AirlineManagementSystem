import React, { useMemo, useState } from 'react'
import { FlightServiceItem, PassengerInFlightRow } from '../../../types'

interface InFlightPanelProps {
  passengers: PassengerInFlightRow[]
  services: FlightServiceItem[]
  onUpdatePassenger: (p: PassengerInFlightRow) => void
}

const InFlightPanel: React.FC<InFlightPanelProps> = ({ passengers, services, onUpdatePassenger }) => {
  const mealOptions = useMemo(() => services.filter((s) => s.category === 'meal'), [services])
  const ancillaryOptions = useMemo(() => services.filter((s) => s.category === 'ancillary'), [services])
  const shoppingOptions = useMemo(() => services.filter((s) => s.category === 'shopping'), [services])

  const [selectedPassenger, setSelectedPassenger] = useState<PassengerInFlightRow | null>(null)

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meal Pref</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ancillaries</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meal</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shopping</th>
              <th className="px-4 py-2"/>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {passengers.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{p.name}</td>
                <td className="px-4 py-2 text-sm">{p.seat_no || '-'}</td>
                <td className="px-4 py-2 text-sm">{p.meal_preference}</td>
                <td className="px-4 py-2 text-sm">{p.selected_ancillary_ids.length}</td>
                <td className="px-4 py-2 text-sm">{p.selected_meal_id ? mealOptions.find((m) => m.id === p.selected_meal_id)?.name : '-'}</td>
                <td className="px-4 py-2 text-sm">{p.selected_shopping_item_ids.length}</td>
                <td className="px-4 py-2 text-sm">
                  <button onClick={() => setSelectedPassenger(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPassenger && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Update Services - {selectedPassenger.name}</h4>
            <button onClick={() => setSelectedPassenger(null)} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
              <select value={selectedPassenger.meal_preference} onChange={(e) => setSelectedPassenger({ ...selectedPassenger, meal_preference: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
              <select value={selectedPassenger.selected_meal_id || ''} onChange={(e) => setSelectedPassenger({ ...selectedPassenger, selected_meal_id: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                {mealOptions.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ancillaries</label>
              <div className="border rounded p-2 max-h-40 overflow-auto space-y-1">
                {ancillaryOptions.map((a) => {
                  const checked = selectedPassenger.selected_ancillary_ids.includes(a.id)
                  return (
                    <label key={a.id} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        const next = e.target.checked
                          ? [...selectedPassenger.selected_ancillary_ids, a.id]
                          : selectedPassenger.selected_ancillary_ids.filter((x) => x !== a.id)
                        setSelectedPassenger({ ...selectedPassenger, selected_ancillary_ids: next })
                      }} />
                      <span>{a.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shopping Items</label>
            <div className="border rounded p-2 max-h-40 overflow-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shoppingOptions.map((s) => {
                const checked = selectedPassenger.selected_shopping_item_ids.includes(s.id)
                return (
                  <label key={s.id} className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      const next = e.target.checked
                        ? [...selectedPassenger.selected_shopping_item_ids, s.id]
                        : selectedPassenger.selected_shopping_item_ids.filter((x) => x !== s.id)
                      setSelectedPassenger({ ...selectedPassenger, selected_shopping_item_ids: next })
                    }} />
                    <span>{s.name}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => { selectedPassenger && onUpdatePassenger(selectedPassenger); setSelectedPassenger(null) }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InFlightPanel



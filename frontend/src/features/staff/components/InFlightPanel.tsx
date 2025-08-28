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
  const [isAddingService, setIsAddingService] = useState(false)

  const calculateTotal = (passenger: PassengerInFlightRow) => {
    let total = 0;
    if (passenger.selectedMealId) {
      const meal = mealOptions.find(m => m.id === passenger.selectedMealId);
      if (meal) total += meal.price;
    }
    passenger.selectedAncillaryIds.forEach(id => {
      const service = ancillaryOptions.find(s => s.id === id);
      if (service) total += service.price;
    });
    passenger.selectedShoppingItemIds.forEach(id => {
      const service = shoppingOptions.find(s => s.id === id);
      if (service) total += service.price;
    });
    return total.toFixed(2);
  };

  const handleClearServices = (passengerId: number) => {
    const passenger = passengers.find(p => p.passengerId === passengerId);
    // console.log(passenger)
    if (passenger) {
      const clearedPassenger = {
        ...passenger,
        selectedMealId: undefined,
        selectedAncillaryIds: [],
        selectedShoppingItemIds: [],
      };
      onUpdatePassenger(clearedPassenger);
    }
  };

  const handleEditService = (passenger: PassengerInFlightRow) => {
    // handleClearServices(passenger.passengerId)
    setSelectedPassenger(passenger);
    setIsAddingService(false);
  };

  // console.log(selectedPassenger)

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meal Pref</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {passengers.map((p) => (
              <tr key={p.passengerId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-2 text-sm">{p.seatNumber || '-'}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    !(p.mealPreference.toLowerCase().includes("non")) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {p.mealPreference}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="space-y-1">
                    {p.selectedMealId && (
                      <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {mealOptions.find((m) => m.id === p.selectedMealId)?.name}
                      </div>
                    )}
                    {p.selectedAncillaryIds.length > 0 && (
                      <div className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        {p.selectedAncillaryIds.length} ancillary{p.selectedAncillaryIds.length > 1 ? 'ies' : 'y'}
                      </div>
                    )}
                    {p.selectedShoppingItemIds.length > 0 && (
                      <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                        {p.selectedShoppingItemIds.length} item{p.selectedShoppingItemIds.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {!p.selectedMealId && p.selectedAncillaryIds.length === 0 && p.selectedShoppingItemIds.length === 0 && (
                      <div className="text-xs text-gray-500">No services</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm font-medium">
                  ${calculateTotal(p)}
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditService(p)} 
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Edit Service
                    </button>
                    <button 
                      onClick={() => handleClearServices(p.passengerId)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      disabled={!p.selectedMealId && p.selectedAncillaryIds.length === 0 && p.selectedShoppingItemIds.length === 0}
                    >
                      Clear
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPassenger && (
        <div className="border rounded p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">
              {isAddingService ? 'Add Services' : 'Edit Services'} - {selectedPassenger.name}
            </h4>
            <div className="flex space-x-2">
              <button onClick={() => setSelectedPassenger(null)} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
              <select 
                value={selectedPassenger.mealPreference} 
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPassenger({ 
                    ...selectedPassenger, 
                    mealPreference: value as 'veg' | 'non-veg' 
                  });
                }} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
              <select 
                value={selectedPassenger.selectedMealId || ''} 
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPassenger({ 
                    ...selectedPassenger, 
                    selectedMealId: value ? Number(value) : undefined 
                  });
                }} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                  const checked = selectedPassenger.selectedAncillaryIds.includes(a.id)
                  return (
                    <label key={a.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={checked} onChange={(e) => {
                          const next = e.target.checked
                            ? [...selectedPassenger.selectedAncillaryIds, a.id]
                            : selectedPassenger.selectedAncillaryIds.filter((x) => x !== a.id)
                          setSelectedPassenger({ ...selectedPassenger, selectedAncillaryIds: next })
                        }} />
                        <span>{a.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">${a.price}</span>
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
                const checked = selectedPassenger.selectedShoppingItemIds.includes(s.id)
                return (
                  <label key={s.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        const next = e.target.checked
                          ? [...selectedPassenger.selectedShoppingItemIds, s.id]
                          : selectedPassenger.selectedShoppingItemIds.filter((x) => x !== s.id)
                        setSelectedPassenger({ ...selectedPassenger, selectedShoppingItemIds: next })
                      }} />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">${s.price}</span>
                  </label>
                )
              })}
            </div>
          </div>
          
          {/* Service Summary */}
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-2">Service Summary</h5>
            <div className="space-y-2 text-sm">
              {selectedPassenger.selectedMealId && (
                <div className="flex justify-between">
                  <span>Selected Meal:</span>
                  <span className="font-medium">
                    {mealOptions.find(m => m.id === selectedPassenger.selectedMealId)?.name}
                  </span>
                </div>
              )}
              {selectedPassenger.selectedAncillaryIds.length > 0 && (
                <div>
                  <span className="font-medium">Ancillaries:</span>
                  <ul className="ml-4 mt-1">
                    {selectedPassenger.selectedAncillaryIds.map(id => {
                      const service = ancillaryOptions.find(s => s.id === id);
                      return service ? (
                        <li key={id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span>${service.price}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {selectedPassenger.selectedShoppingItemIds.length > 0 && (
                <div>
                  <span className="font-medium">Shopping Items:</span>
                  <ul className="ml-4 mt-1">
                    {selectedPassenger.selectedShoppingItemIds.map(id => {
                      const service = shoppingOptions.find(s => s.id === id);
                      return service ? (
                        <li key={id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span>${service.price}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    ${calculateTotal(selectedPassenger)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => { 
                if (selectedPassenger) {
                  onUpdatePassenger(selectedPassenger); 
                  setSelectedPassenger(null);
                  setIsAddingService(false);
                }
              }} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InFlightPanel



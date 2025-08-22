import React, { useMemo, useState } from 'react'
import { FlightRow, FlightServiceItem, NewServiceItem, ServiceCategory } from '../../../types'

interface FlightServicesModalProps {
  isOpen: boolean
  flight: FlightRow | null
  services: FlightServiceItem[]
  onAdd: (flightId: number, item: NewServiceItem) => void
  onUpdate: (flightId: number, updated: FlightServiceItem) => void
  onDelete: (flightId: number, serviceId: number) => void
  onClose: () => void
}

const FlightServicesModal: React.FC<FlightServicesModalProps> = ({ isOpen, flight, services, onAdd, onUpdate, onDelete, onClose }) => {
  const [category, setCategory] = useState<ServiceCategory | ''>('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [mealType, setMealType] = useState<'veg' | 'non-veg'>('veg')
  const [editingId, setEditingId] = useState<number | null>(null)

  const title = useMemo(() => `Manage Services - ${flight?.flight_number ?? ''} (${flight?.id ?? ''})`, [flight])

  const isValidAdd = useMemo(() => {
    const hasCategory = category === 'ancillary' || category === 'meals' || category === 'shopping'
    const hasName = name.trim().length > 0
    const hasPrice = Number.isFinite(price) && price > 0
    const hasMealType = category !== 'meals' || (mealType === 'veg' || mealType === 'non-veg')
    return hasCategory && hasName && hasPrice && hasMealType
  }, [category, name, price, mealType])

  if (!isOpen) return null

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!flight) return
    if (!isValidAdd) return
    let item: NewServiceItem
    if (category === 'ancillary') {
      item = { category: 'ancillary', name, price } as NewServiceItem
    } else if (category === 'meals') {
      item = { category: 'meals', name, meal_type: mealType, price } as NewServiceItem
    } else {
      item = { category: 'shopping', name, price } as NewServiceItem
    }
    onAdd(flight.id, item)
    setName('')
    setPrice(0)
    setCategory('')
    setMealType('veg')
  }

  const handleInlineUpdate = (orig: FlightServiceItem) => {
    if (!flight) return
    onUpdate(flight.id, orig)
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      </div>
      <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory | '')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>Select category</option>
              <option value="ancillary">Ancillary</option>
              <option value="meals">Meal</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {category === 'meals' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
              <select required value={mealType} onChange={(e) => setMealType(e.target.value as 'veg' | 'non-veg')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" min={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={!isValidAdd} className={`px-4 py-2 rounded-md text-white ${isValidAdd ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}>Add Service</button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((s) => {
              // console.log(s)

              return (<tr key={s.id || s.serviceId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{s.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === s.id ? (
                    <input className="w-full px-2 py-1 border border-gray-300 rounded" value={s.name} onChange={(e) => (s as any).name = e.target.value} />
                  ) : (
                    <div className="text-sm text-gray-900">{s.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {'meal_type' in s ? (
                    editingId === s.id ? (
                      <select className="px-2 py-1 border border-gray-300 rounded" value={(s as any).meal_type} onChange={(e) => (s as any).meal_type = e.target.value}>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-900">{(s as any).meal_type}</span>
                    )
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === s.id ? (
                    <input type="number" className="w-24 px-2 py-1 border border-gray-300 rounded" value={s.price} onChange={(e) => (s as any).price = Number(e.target.value)} />
                  ) : (
                    <div className="text-sm text-gray-900">${s.price}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === s.id ? (
                    <div className="flex space-x-2">
                      <button onClick={() => handleInlineUpdate(s)} className="text-green-600 hover:text-green-800">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingId(s.id)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => flight && onDelete(flight.id, s.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  )}
                </td>
              </tr>)
})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FlightServicesModal



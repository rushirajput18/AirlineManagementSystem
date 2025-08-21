import React from 'react'
import { NewFlight } from '../../../types'

interface NewFlightFormProps {
  form: NewFlight
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  submitLabel?: string
}

const NewFlightForm: React.FC<NewFlightFormProps> = ({ form, onChange, onSubmit, submitLabel = 'Add Flight' }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
        <input type="text" name="flight_number" value={form.flight_number} onChange={onChange} required placeholder="e.g., AA101" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
        <input type="text" name="departure" value={form.departure || ''} onChange={onChange} required placeholder="e.g., New York" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <input type="text" name="destination" value={form.destination || ''} onChange={onChange} required placeholder="e.g., Los Angeles" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
        <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
        <input type="datetime-local" name="arrival_time" value={form.arrival_time} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
    <div className="flex justify-end space-x-3 pt-4">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{submitLabel}</button>
    </div>
  </form>
)

export default NewFlightForm



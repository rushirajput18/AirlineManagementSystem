import React from 'react'
import { NewPassenger } from '../../../types'

interface NewPassengerFormProps {
  form: NewPassenger
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const NewPassengerForm: React.FC<NewPassengerFormProps> = ({ form, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" name="name" value={form.name} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
        <input type="text" name="passport" value={form.passport} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Preference</label>
        <select name="meal_preference" value={form.meal_preference} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Vegetarian</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <textarea name="address" value={form.address} onChange={onChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
    <div className="flex space-x-4">
      <label className="flex items-center">
        <input type="checkbox" name="need_wheelchair" checked={form.need_wheelchair} onChange={onChange} className="mr-2" />
        <span className="text-sm text-gray-700">Need Wheelchair</span>
      </label>
      <label className="flex items-center">
        <input type="checkbox" name="travelling_with_infant" checked={form.travelling_with_infant} onChange={onChange} className="mr-2" />
        <span className="text-sm text-gray-700">Travelling with Infant</span>
      </label>
    </div>
    <div className="flex justify-end space-x-3 pt-4">
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Passenger</button>
    </div>
  </form>
)

export default NewPassengerForm



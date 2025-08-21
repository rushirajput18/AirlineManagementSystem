import React, { useMemo, useState, useEffect } from 'react'
import { PassengerCheckInRow, SeatCell } from '../../../types'

interface CheckInPanelProps {
  passengers: PassengerCheckInRow[]
  seats: SeatCell[]
  onAssignSeat: (passengerId: number, seatNo: string) => void
  onCheckIn: (passengerId: number) => void
  onCheckOut: (passengerId: number) => void
}

const CheckInPanel: React.FC<CheckInPanelProps> = ({ passengers, seats, onAssignSeat, onCheckIn, onCheckOut }) => {
  const [filterWheelchair, setFilterWheelchair] = useState<boolean | null>(null)
  const [filterInfant, setFilterInfant] = useState<boolean | null>(null)
  const [filterCheckedIn, setFilterCheckedIn] = useState<boolean | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>({})

  // Initialize selected seats from passengers who already have seats assigned
  useEffect(() => {
    const initialSeats: Record<number, string> = {}
    passengers.forEach(p => {
      if (p.seat_no) {
        initialSeats[p.id] = p.seat_no
      }
    })
    setSelectedSeats(initialSeats)
  }, [passengers])

  const filteredPassengers = useMemo(() => {
    return passengers.filter((p) => {
      if (filterWheelchair !== null && p.need_wheelchair !== filterWheelchair) return false
      if (filterInfant !== null && p.travelling_with_infant !== filterInfant) return false
      if (filterCheckedIn !== null && p.checked_in !== filterCheckedIn) return false
      return true
    })
  }, [passengers, filterWheelchair, filterInfant, filterCheckedIn])

  const availableSeats = useMemo(() => seats.filter((s) => !s.occupied), [seats])

  const seatGrid = useMemo(() => {
    // Simple 6 columns layout
    const cols = 6
    const rows: SeatCell[][] = []
    for (let i = 0; i < seats.length; i += cols) {
      rows.push(seats.slice(i, i + cols))
    }
    return rows
  }, [seats])

  const handleSeatSelection = (passengerId: number, seatNo: string) => {
    setSelectedSeats(prev => ({ ...prev, [passengerId]: seatNo }))
    onAssignSeat(passengerId, seatNo)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">Filters:</span>
        <select className="text-sm border rounded px-2 py-1" value={filterWheelchair === null ? '' : filterWheelchair ? 'yes' : 'no'} onChange={(e) => setFilterWheelchair(e.target.value === '' ? null : e.target.value === 'yes')}>
          <option value="">Wheelchair (Any)</option>
          <option value="yes">Needs Wheelchair</option>
          <option value="no">No Wheelchair</option>
        </select>
        <select className="text-sm border rounded px-2 py-1" value={filterInfant === null ? '' : filterInfant ? 'yes' : 'no'} onChange={(e) => setFilterInfant(e.target.value === '' ? null : e.target.value === 'yes')}>
          <option value="">Infant (Any)</option>
          <option value="yes">With Infant</option>
          <option value="no">No Infant</option>
        </select>
        <select className="text-sm border rounded px-2 py-1" value={filterCheckedIn === null ? '' : filterCheckedIn ? 'yes' : 'no'} onChange={(e) => setFilterCheckedIn(e.target.value === '' ? null : e.target.value === 'yes')}>
          <option value="">Checked-In (Any)</option>
          <option value="yes">Checked-In</option>
          <option value="no">Not Checked-In</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Passport</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Checked-In</th>
                <th className="px-4 py-2"/>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPassengers.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{p.name}</td>
                  <td className="px-4 py-2 text-sm">{p.date_of_birth || '-'}</td>
                  <td className="px-4 py-2 text-sm">{p.passport || '-'}</td>
                  <td className="px-4 py-2 text-sm">{p.address || '-'}</td>
                  <td className="px-4 py-2 text-sm">{p.seat_no || '-'}</td>
                  <td className="px-4 py-2 text-sm">{p.checked_in ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {!p.checked_in ? (
                        <select 
                          className="border rounded px-2 py-1" 
                          value={selectedSeats[p.id] || ''}
                          onChange={(e) => e.target.value && handleSeatSelection(p.id, e.target.value)}
                        >
                          <option value="" disabled>Select Seat</option>
                          {availableSeats.map((s) => (
                            <option key={`${p.id}-${s.seat_no}`} value={s.seat_no}>{s.seat_no}</option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => onCheckOut(p.id)} className="text-red-600 hover:text-red-800">Check-out</button>
                      )}
                      {!p.checked_in && (
                        <button onClick={() => onCheckIn(p.id)} className="text-blue-600 hover:text-blue-800">Check-in</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Seat Map</h4>
          <div className="border rounded p-3 grid grid-cols-6 gap-2">
            {seatGrid.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((seat) => (
                  <div key={seat.seat_no} className={`text-center text-xs px-2 py-3 rounded ${seat.occupied ? 'bg-gray-300 text-gray-600' : 'bg-green-100 text-green-800'}`}>
                    {seat.seat_no}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">Gray = occupied, Green = available</div>
        </div>
      </div>
    </div>
  )
}

export default CheckInPanel



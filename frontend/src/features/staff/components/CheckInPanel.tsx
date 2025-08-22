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
      if (p.seatNumber) {
        initialSeats[p.passengerId] = p.seatNumber
      }
    })
    setSelectedSeats(initialSeats)
  }, [passengers])

  const filteredPassengers = useMemo(() => {
    return passengers.filter((p) => {
      if (filterWheelchair !== null && p.need_wheelchair !== filterWheelchair) return false
      if (filterInfant !== null && p.travelling_with_infant !== filterInfant) return false
      if (filterCheckedIn !== null && p.checkedIn !== filterCheckedIn) return false
      return true
    })
  }, [passengers, filterWheelchair, filterInfant, filterCheckedIn])

  // Get all seats that are currently assigned to any passenger
  const assignedSeats = useMemo(() => {
    return passengers
      .filter(p => p.seatNumber)
      .map(p => p.seatNumber!)
  }, [passengers])

  // Available seats exclude both occupied seats and seats assigned to other passengers
  const availableSeats = useMemo(() => {
    return seats.filter((s) => !s.occupied && !assignedSeats.includes(s.seat_no))
  }, [seats, assignedSeats])

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
    console.log(`Attempting to assign seat ${seatNo} to passenger ${passengerId}`)
    
    // Check if the seat is already assigned to another passenger
    const seatAlreadyAssigned = passengers.some(p => 
      p.passengerId !== passengerId && p.seatNumber === seatNo
    )
    
    if (seatAlreadyAssigned) {
      console.warn(`Seat ${seatNo} is already assigned to another passenger`)
      alert(`Seat ${seatNo} is already assigned to another passenger. Please select a different seat.`)
      return
    }

    // Clear any existing seat assignment for this passenger first
    const currentPassenger = passengers.find(p => p.passengerId === passengerId)
    if (currentPassenger?.seatNumber) {
      console.log(`Clearing existing seat assignment ${currentPassenger.seatNumber} for passenger ${passengerId}`)
    }

    setSelectedSeats(prev => ({ ...prev, [passengerId]: seatNo }))
    onAssignSeat(passengerId, seatNo)
    console.log(`Successfully assigned seat ${seatNo} to passenger ${passengerId}`)
  }

  const handleCheckIn = (passengerId: number) => {
    const passenger = passengers.find(p => p.passengerId === passengerId)
    if (!passenger?.seatNumber) {
      alert('Please assign a seat before checking in the passenger.')
      return
    }
    console.log(`Checking in passenger ${passengerId} with seat ${passenger.seatNumber}`)
    onCheckIn(passengerId)
  }

  const handleCheckOut = (passengerId: number) => {
    console.log(`Checking out passenger ${passengerId}`)
    onCheckOut(passengerId)
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPassengers.map((p) => (
                <tr key={p.passengerId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{p.passengerId}</td>
                  <td className="px-4 py-2 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-2 text-sm">{p.seatClass || '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    {p.seatNumber ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {p.seatNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {p.checkedIn ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Checked In
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center space-x-2">
                      {!p.checkedIn ? (
                        <>
                          <select 
                            className="border rounded px-2 py-1 text-sm" 
                            value={selectedSeats[p.passengerId] || ''}
                            onChange={(e) => e.target.value && handleSeatSelection(p.passengerId, e.target.value)}
                          >
                            <option value="">Select Seat</option>
                            {availableSeats.map((s) => (
                              <option key={`${p.passengerId}-${s.seat_no}`} value={s.seat_no}>{s.seat_no}</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleCheckIn(p.passengerId)} 
                            disabled={!p.seatNumber}
                            className={`px-3 py-1 text-sm rounded ${
                              p.seatNumber 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Check-in
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleCheckOut(p.passengerId)} 
                          className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          Check-out
                        </button>
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
                {row.map((seat) => {
                  const isAssigned = passengers.some(p => p.seatNumber === seat.seat_no)
                  const assignedPassenger = passengers.find(p => p.seatNumber === seat.seat_no)
                  const isCheckedIn = assignedPassenger?.checkedIn
                  
                  return (
                    <div 
                      key={seat.seat_no} 
                      className={`text-center text-xs px-2 py-3 rounded ${
                        seat.occupied || isAssigned
                          ? isCheckedIn
                            ? 'bg-green-300 text-green-800 font-medium'
                            : 'bg-yellow-300 text-yellow-800 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title={assignedPassenger ? `Assigned to ${assignedPassenger.name} (${isCheckedIn ? 'Checked In' : 'Not Checked In'})` : 'Available'}
                    >
                      {seat.seat_no}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
                Available
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 rounded mr-1"></div>
                Assigned (Not Checked In)
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-300 rounded mr-1"></div>
                Checked In
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckInPanel



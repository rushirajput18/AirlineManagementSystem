export type UserRole = 'admin' | 'staff'

export interface UserData {
  id: number
  name: string
  email: string
}

export interface FlightRow {
  id: number
  flight_number: string
  flight_route: string
  departure_time: string
  arrival_time: string
}

export interface AssignedFlightRow {
  id: string
  name: string
  destination: string
  departure: string
  status: 'Boarding' | 'Check-in Open' | 'In Flight' | 'Scheduled'
  checkInStatus: 'In Progress' | 'Open' | 'Closed' | 'Not Started'
  passengers: number
  checkedIn: number
}

export interface PassengerRow {
  id: number
  name: string
  date_of_birth: string
  passport: string
  meal_preference: 'veg' | 'non-veg'
  need_wheelchair: boolean
  travelling_with_infant: boolean
}

export interface NewPassenger {
  name: string
  date_of_birth: string
  passport: string
  address: string
  meal_preference: 'veg' | 'non-veg'
  need_wheelchair: boolean
  travelling_with_infant: boolean
}

export interface NewFlight {
  flight_number: string
  flight_route: string
  departure_time: string
  arrival_time: string
}



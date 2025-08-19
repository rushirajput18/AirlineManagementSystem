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
  address?: string
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
  // Keep flight_route for backend compatibility; derive from departure/destination in the UI
  flight_route: string
  departure?: string
  destination?: string
  departure_time: string
  arrival_time: string
}

export type ServiceCategory = 'ancillary' | 'meal' | 'shopping'

export interface BaseServiceItem {
  id: number
  category: ServiceCategory
}

export interface AncillaryServiceItem extends BaseServiceItem {
  category: 'ancillary'
  name: string
  price: number
}

export interface MealServiceItem extends BaseServiceItem {
  category: 'meal'
  name: string
  meal_type: 'veg' | 'non-veg'
  price: number
}

export interface ShoppingItemServiceItem extends BaseServiceItem {
  category: 'shopping'
  name: string
  price: number
}

export type FlightServiceItem = AncillaryServiceItem | MealServiceItem | ShoppingItemServiceItem

export type NewServiceItem =
  | Omit<AncillaryServiceItem, 'id'>
  | Omit<MealServiceItem, 'id'>
  | Omit<ShoppingItemServiceItem, 'id'>

export interface PassengerFilters {
  missingDOB: boolean
  missingPassport: boolean
  missingAddress: boolean
}



export type UserRole = 'admin' | 'staff'

export interface UserData {
  id: number
  name: string
  email: string
}

export type BackendFlight = {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
};


export type BackendService = {
  serviceId: number;
  flightId: number;
  category: string;
  name: string;
  type?: string | null;
  price: number;
};


export interface Flight {
  flightId: number;
  flightNumber: string;
  origin: string | null;
  destination: string | null;
  departureTime: string;
  arrivalTime: string;
}

export interface FlightRow {
  id: number
  flight_number: string
  flight_route: string
  departure_time: string
  arrival_time: string
}

export interface AssignedFlightRow {
  id: number
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

export interface PassengerCheckInRow {
  passengerId: number
  name: string
  isCheckedIn: boolean
  seatNumber: string | null
  seatClass: string
  need_wheelchair?: boolean
  travelling_with_infant?: boolean
}

export interface PassengerInFlightRow extends PassengerCheckInRow {
  mealPreference: 'veg' | 'non-veg'
  selectedAncillaryIds: number[]
  selectedMealId?: number
  selectedShoppingItemIds: number[]
}

export interface SeatCell {
  seat_no: string
  occupied: boolean
  passenger_id?: number
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
  serviceId: number | null
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

export type FlightPlan = {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
};
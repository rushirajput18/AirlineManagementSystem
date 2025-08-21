# Staff Module API Documentation

This document provides comprehensive API endpoint documentation for the Staff module of the Airline Management System.

## Overview

The Staff module provides RESTful APIs for managing passenger check-in processes and in-flight services. All endpoints are prefixed with `/staff`.

## Base URL
```
http://localhost:8084/staff
```

---

## Common Flight Management APIs

### Staff Passenger Controller (`/staff`)

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/staff/flights` | Get all flights assigned to staff | - | `List<FlightDTO>` | 200 OK |

---

## Check-In Service APIs

### Passenger Check-In Management

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/staff/flights/{flightId}/passengers` | Get all passengers for a flight with seat and check-in status | - | `List<PassengerSeatDTO>` | 200 OK |
| GET | `/staff/flights/{flightId}/seats` | Get seat map with availability for check-in | - | `List<SeatDTO>` | 200 OK |
| PUT | `/staff/flights/{flightId}/passengers/{passengerId}/checkin` | Check-in a passenger by assigning an available seat | - | `PassengerCheckInDTO` | 200 OK |
| PUT | `/staff/flights/{flightId}/passengers/{passengerId}/checkout` | Check-out a passenger and release the assigned seat | - | `PassengerCheckInDTO` | 200 OK |

### Passenger Seat DTO Structure
```json
{
  "passengerId": "Long",
  "name": "String",
  "dateOfBirth": "String (ISO Date)",
  "passport": "String",
  "address": "String",
  "seatNo": "String",
  "checkedIn": "Boolean",
  "needWheelchair": "Boolean",
  "travellingWithInfant": "Boolean"
}
```

### Seat DTO Structure
```json
{
  "seatNo": "String",
  "occupied": "Boolean",
  "passengerId": "Long (optional)"
}
```

### Passenger Check-In DTO Structure
```json
{
  "passengerId": "Long",
  "seatNo": "String",
  "checkedIn": "Boolean",
  "checkInTime": "String (ISO DateTime)"
}
```

---

## In-Flight Service APIs

### Passenger In-Flight Management

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/staff/flights/{flightId}/inflight/passengers` | Get all passengers for a flight with in-flight details | - | `List<PassengerInFlightDTO>` | 200 OK |
| POST | `/staff/passengers/{passengerId}/inflight/ancillaries` | Select ancillary services for a passenger | `AncillaryDTO` | `String` | 200 OK |
| PUT | `/staff/passengers/{passengerId}/inflight/ancillaries` | Update selected ancillary services for a passenger | `AncillaryDTO` | - | 200 OK |
| POST | `/staff/passengers/{passengerId}/inflight/meals/preference` | Select meal preference for a passenger | `MealPreferenceDTO` | - | 200 OK |
| PUT | `/staff/passengers/{passengerId}/inflight/meals/preference` | Update meal preference for a passenger | `MealPreferenceDTO` | - | 200 OK |
| POST | `/staff/passengers/{passengerId}/inflight/shopping` | Select in-flight shopping items for a passenger | `ShoppingDTO` | - | 200 OK |
| PUT | `/staff/passengers/{passengerId}/inflight/shopping` | Update selected in-flight shopping items for a passenger | `ShoppingDTO` | - | 200 OK |

### Passenger In-Flight DTO Structure
```json
{
  "passengerId": "Long",
  "name": "String",
  "seatNo": "String",
  "mealPreference": "String (veg/non-veg)",
  "selectedAncillaryIds": "List<Long>",
  "selectedMealId": "Long (optional)",
  "selectedShoppingItemIds": "List<Long>"
}
```

### Ancillary DTO Structure
```json
{
  "ancillaryIds": "List<Long>"
}
```

### Meal Preference DTO Structure
```json
{
  "mealPreference": "String (veg/non-veg)",
  "selectedMealId": "Long (optional)"
}
```

### Shopping DTO Structure
```json
{
  "shoppingItemIds": "List<Long>"
}
```

---

## Authentication & Authorization

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Error Responses

### Standard Error Response Format
```json
{
  "timestamp": "String (ISO DateTime)",
  "status": "Integer",
  "error": "String",
  "message": "String",
  "path": "String"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Examples

### Get All Flights for Staff
```bash
curl -X GET http://localhost:8084/staff/flights \
  -H "Authorization: Bearer <jwt_token>"
```

### Get Passengers for Check-In
```bash
curl -X GET http://localhost:8084/staff/flights/1/passengers \
  -H "Authorization: Bearer <jwt_token>"
```

### Get Seat Map for a Flight
```bash
curl -X GET http://localhost:8084/staff/flights/1/seats \
  -H "Authorization: Bearer <jwt_token>"
```

### Check-In a Passenger
```bash
curl -X PUT http://localhost:8084/staff/flights/1/passengers/123/checkin \
  -H "Authorization: Bearer <jwt_token>"
```

### Check-Out a Passenger
```bash
curl -X PUT http://localhost:8084/staff/flights/1/passengers/123/checkout \
  -H "Authorization: Bearer <jwt_token>"
```

### Get In-Flight Passengers
```bash
curl -X GET http://localhost:8084/staff/flights/1/inflight/passengers \
  -H "Authorization: Bearer <jwt_token>"
```

### Select Ancillary Services
```bash
curl -X POST http://localhost:8084/staff/passengers/123/inflight/ancillaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "ancillaryIds": [1, 2, 3]
  }'
```

### Update Meal Preference
```bash
curl -X PUT http://localhost:8084/staff/passengers/123/inflight/meals/preference \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "mealPreference": "veg",
    "selectedMealId": 5
  }'
```

### Select Shopping Items
```bash
curl -X POST http://localhost:8084/staff/passengers/123/inflight/shopping \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "shoppingItemIds": [1, 4]
  }'
```

## Workflow Examples

### Complete Check-In Process
1. Get all flights: `GET /staff/flights`
2. Get passengers for specific flight: `GET /staff/flights/{flightId}/passengers`
3. Get seat map: `GET /staff/flights/{flightId}/seats`
4. Check-in passenger: `PUT /staff/flights/{flightId}/passengers/{passengerId}/checkin`

### Complete In-Flight Service Process
1. Get in-flight passengers: `GET /staff/flights/{flightId}/inflight/passengers`
2. Select ancillary services: `POST /staff/passengers/{passengerId}/inflight/ancillaries`
3. Update meal preference: `PUT /staff/passengers/{passengerId}/inflight/meals/preference`
4. Select shopping items: `POST /staff/passengers/{passengerId}/inflight/shopping`

## Notes

- All timestamps are in ISO 8601 format
- IDs are Long integers
- Boolean values are true/false
- String fields should not be null unless explicitly allowed
- The system automatically handles DTO to Entity conversions
- All endpoints return JSON responses
- Check-in and check-out operations are atomic
- Seat assignments are validated for availability
- In-flight services can be updated multiple times

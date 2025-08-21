# Admin Module API Documentation

This document provides comprehensive API endpoint documentation for the Admin module of the Airline Management System.

## Overview

The Admin module provides RESTful APIs for managing flights, passengers, flight services, and users. All endpoints are prefixed with `/admin`.

## Base URL
```
http://localhost:8084/admin
```

---

## Flight Management APIs

### Flight Controller (`/admin/flights`)

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/admin/flights` | Get all flights | - | `List<FlightDTO>` | 200 OK |
| GET | `/admin/flights/search` | Search flights by route | Query Param: `route` | `List<FlightDTO>` | 200 OK |
| GET | `/admin/flights/{flightId}` | Get flight by ID | - | `FlightDTO` | 200 OK, 404 Not Found |
| POST | `/admin/flights` | Add new flight | `FlightDTO` | `FlightDTO` | 200 OK |
| PUT | `/admin/flights/{flightId}` | Update flight | `FlightDTO` | `FlightDTO` | 200 OK, 400 Bad Request |
| DELETE | `/admin/flights/{flightId}` | Delete flight | - | - | 204 No Content |

### Flight DTO Structure
```json
{
  "flightId": "Long",
  "flightNumber": "String",
  "origin": "String",
  "destination": "String",
  "departureTime": "String (ISO DateTime)",
  "arrivalTime": "String (ISO DateTime)"
}
```

---

## Passenger Management APIs

### Passenger Controller (`/admin/passengers`)

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/admin/passengers/{passengerId}` | Get passenger by ID | - | `PassengerDTO` | 200 OK, 404 Not Found |
| GET | `/admin/passengers/flight/{flightId}` | Get passengers by flight ID | Query Param: `filter` (optional) | `List<PassengerDTO>` | 200 OK |
| POST | `/admin/passengers` | Add new passenger | `PassengerDTO` | `PassengerDTO` | 200 OK |
| PUT | `/admin/passengers/{passengerId}` | Update passenger | `PassengerDTO` | `PassengerDTO` | 200 OK, 400 Bad Request |
| DELETE | `/admin/passengers/{passengerId}` | Delete passenger | - | - | 204 No Content |

### Passenger DTO Structure
```json
{
  "passengerId": "Long",
  "name": "String",
  "dateOfBirth": "String (ISO Date)",
  "passport": "String",
  "address": "String",
  "mealPreference": "String (veg/non-veg)",
  "needsWheelchair": "Boolean",
  "travellingWithInfant": "Boolean",
  "flightId": "Long"
}
```

### Passenger Filter Options
- `missingdob` - Filter passengers with missing date of birth
- `missingpassport` - Filter passengers with missing passport
- `missingaddress` - Filter passengers with missing address

---

## Flight Services Management APIs

### Flight Service Controller (`/admin/flight-services`)

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/admin/flight-services/flight/{flightId}` | Get all services for a flight | - | `List<FlightServiceDTO>` | 200 OK |
| GET | `/admin/flight-services/flight/{flightId}/category/{category}` | Get services by category | - | `List<FlightServiceDTO>` | 200 OK |
| GET | `/admin/flight-services/{serviceId}` | Get service by ID | - | `FlightServiceDTO` | 200 OK, 404 Not Found |
| POST | `/admin/flight-services` | Add new service to flight | `FlightServiceDTO` | `FlightServiceDTO` | 200 OK |
| PUT | `/admin/flight-services` | Update service | `FlightServiceDTO` | `FlightServiceDTO` | 200 OK |
| DELETE | `/admin/flight-services/{serviceId}` | Delete service | - | - | 204 No Content |

### Flight Service DTO Structure
```json
{
  "serviceId": "Long",
  "flightId": "Long",
  "category": "String",
  "name": "String",
  "type": "String",
  "price": "Double"
}
```

---

## User Management APIs

### User Controller (`/admin/users`)

| Method | Endpoint | Description | Request Body | Response | Status Codes |
|--------|----------|-------------|--------------|----------|--------------|
| GET | `/admin/users` | Get all users | - | `List<UserDTO>` | 200 OK |
| GET | `/admin/users/{userId}` | Get user by ID | - | `UserDTO` | 200 OK, 404 Not Found |
| GET | `/admin/users/search` | Get user by username | Query Param: `username` | `UserDTO` | 200 OK, 404 Not Found |
| POST | `/admin/users` | Add new user | `UserDTO` | `UserDTO` | 200 OK |
| PUT | `/admin/users/{userId}` | Update user | `UserDTO` | `UserDTO` | 200 OK, 400 Bad Request |
| DELETE | `/admin/users/{userId}` | Delete user | - | - | 204 No Content |

### User DTO Structure
```json
{
  "userId": "Long",
  "username": "String",
  "role": "String (ADMIN/STAFF)"
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

### Create a New Flight
```bash
curl -X POST http://localhost:8084/admin/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "flightNumber": "AA101",
    "origin": "New York",
    "destination": "Los Angeles",
    "departureTime": "2024-01-15T09:00:00",
    "arrivalTime": "2024-01-15T12:30:00"
  }'
```

### Get Passengers for a Flight with Filter
```bash
curl -X GET "http://localhost:8084/admin/passengers/flight/1?filter=missingdob" \
  -H "Authorization: Bearer <jwt_token>"
```

### Add a Service to a Flight
```bash
curl -X POST http://localhost:8084/admin/flight-services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "flightId": 1,
    "category": "meal",
    "name": "Vegetarian Meal",
    "type": "veg",
    "price": 15.00
  }'
```

## Notes

- All timestamps are in ISO 8601 format
- IDs are Long integers
- Boolean values are true/false
- String fields should not be null unless explicitly allowed
- The system automatically handles DTO to Entity conversions
- All endpoints return JSON responses

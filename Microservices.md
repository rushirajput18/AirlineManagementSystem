# FrontEnd Microservice

- The user interface for interacting with the api endpoints 

### Front End Flow: 
### Login Page
- If login is successful:
  - Redirect based on role:
    - Admin → `/admin/dashboard`?
    - Staff → `/staff/home`?

- If login fails:
  - Show error page → `/login-error`? (or display inline error message)

---

### Navigation After Login

- Admin Page
  - Flights are displayed with options on each flight to manage passengers or flights

    - Passenger options for a flight when selected
        - Get a list of all passengers
        - Click on a passenger to view details, update details or delete the passenger
        - Add new passenger

    - Services options for a flight when selected
        - Get a list of all services on the flight 
        - Click on a service to view details, update details or delete the service
        - Add new service 

- Staff Page
  
---

### Invalid Page Request

- If user requests a non-existent or unauthorized page:
  - Show 404 Not Found Page → `/404`?


# Login Microservice

- Login api endpoints that provides login capability for both the staff and admins.

### Endpoints
- `(POST) /api/auth/login` -> for Login
- `(POST) /api/users` -> for creating a user
- `(PUT) /api/users/{id}` -> for modifying a user

Note: Do we need role based access control?

# Admin Microservice
- A set of API endpoints for admin related services.

### Common Endpoint
- `(GET) /admin/flights` -> Display all flights with 2 options for managing passengers or flight services for each flight, with endpoints for each option displayed below

- `(GET) /admin/flights/{flightId}` -> Display that flight's details 

### Endpoints for passenger services
- `(GET) /admin/flights/{flightId}/passengers` -> Get all passenger details for a particular flight Id


- `(POST) /admin/flights/{flightId}/passengers` -> Add a new passenger for a particular flight

- Following will work by selecting a passenger displayed when a particular flight's manage passenger option is selected(will have to display passengers for that flight):

    - `(GET) /admin/passengers/{passengerId}` -> Get details of a particular passenger

    - `(PUT) /admin/passengers/{passengerId}` -> Update an existing passenger for a flight 

    - `(DELETE) /admin/passenger/{passengerId}` -> Delete an existing passenger for a flight

    - Filter?

### Endpoints for flight services
- `(GET) /admin/flights/{flightId}/services` -> Get all services for particular flight Id 

- `(POST) /admin/flights/{flightId}/services` -> Add a new service for a particular flight

- Following will work by selecting a flight service displayed when a particular flight's manage services option is selected(will have to display services for that flight):

    - `(GET) /admin/services/{serviceId}` -> Get details of a particular service

    - `(PUT) /admin/services/{serviceId}` -> Update an existing service for a flight 

    - `(DELETE) /admin/services/{serviceId}` -> Delete an existing service for a flight

# Staff Microservice
- A set of API endpoints for staff related services

### Common Endpoint
- `(GET) /staff/flights` -> Display all flights assigned to the staff, with options for managing check-in and in-flight services

<!-- - `(GET) /staff/flights/{flightId}/dashboard` -> Display dashboard options (check-in service, in-flight service) for the selected flight -->

### Endpoints for Check-In Service
- `(GET) /staff/flights/{flightId}/passengers` -> Get all passengers for a particular flight with seat and check-in status

<!-- - `(GET) /staff/flights/{flightId}/checkin/passengers?wheelchair=true&infant=true&checkedIn=false` -> Filter passengers by wheelchair need, infant status, and check-in status -->

- `(GET) /staff/flights/{flightId}/seats` -> Display seat map with availability for check-in

- `(POST) /staff/passengers/{passengerId}/checkin` -> Check-in a passenger by assigning an available seat

- `(POST) /staff/passengers/{passengerId}/checkout` -> Check-out a passenger and release the assigned seat

### Endpoints for In-Flight Service
- `(GET) /staff/flights/{flightId}/inflight/passengers` -> Get all passengers for a particular flight with in-flight details (meal preference, ancillaries, shopping items)

- `(POST) /staff/passengers/{passengerId}/inflight/ancillaries` -> Select ancillary services for a passenger

- `(PUT) /staff/passengers/{passengerId}/inflight/ancillaries` -> Update selected ancillary services for a passenger

- `(PUT) /staff/passengers/{passengerId}/inflight/meals/preference` -> Update meal preference for a passenger

- `(POST) /staff/passengers/{passengerId}/inflight/meals/preference` -> Select meal preference for a passenger

- `(PUT) /staff/passengers/{passengerId}/inflight/shopping` -> Update selected in-flight shopping items for a passenger

- `(POST) /staff/passengers/{passengerId}/inflight/shopping` -> Select  in-flight shopping items for a passenger
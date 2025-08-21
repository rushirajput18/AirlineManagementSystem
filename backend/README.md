# Airline Management System - Backend

This is the backend service for the Airline Management System, built with Spring Boot and Java.

## Overview

The backend provides RESTful APIs for managing airline operations including flight management, passenger services, check-in processes, and in-flight services. The system is divided into two main modules:

- **Admin Module** - For administrative operations
- **Staff Module** - For operational staff services

## Technology Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL/PostgreSQL (configurable)
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **API Documentation**: RESTful APIs with JSON responses

## Project Structure

```
backend/
├── src/main/java/com/oracle/flightmanagement/
│   ├── admin/                    # Admin module
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data Transfer Objects
│   │   └── filter/              # JWT authentication filters
│   ├── staff/                   # Staff module
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access layer
│   │   ├── entity/              # JPA entities
│   │   └── dto/                 # Data Transfer Objects
│   ├── config/                  # Configuration classes
│   ├── enums/                   # Enumeration classes
│   └── BackendApplication.java  # Main application class
├── src/main/resources/
│   └── application.properties   # Application configuration
└── pom.xml                      # Maven dependencies
```

## API Documentation

### Module-Specific Documentation

- **[Admin Module API Documentation](src/main/java/com/oracle/flightmanagement/admin/README.md)** - Complete API reference for admin operations
- **[Staff Module API Documentation](src/main/java/com/oracle/flightmanagement/staff/README.md)** - Complete API reference for staff operations

### Quick API Overview

| Module | Base URL | Description |
|--------|----------|-------------|
| Admin | `/admin` | Flight, passenger, service, and user management |
| Staff | `/staff` | Check-in and in-flight passenger services |

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL/PostgreSQL database
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AirlineManagementSystem/backend
   ```

2. **Configure database**
   - Update `src/main/resources/application.properties` with your database credentials
   - Ensure the database is running and accessible

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

### Configuration

The application can be configured through `application.properties`:

```properties
# Server Configuration
server.port=8084

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/airline_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

## Authentication

The system uses JWT (JSON Web Tokens) for authentication. All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Login Endpoint

The login endpoint is provided by the login service (separate microservice):

```
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

## Database Schema

The system uses the following main entities:

- **Flights** - Flight information and schedules
- **Passengers** - Passenger details and preferences
- **Flight Services** - Available services for flights
- **Users** - System users (admin/staff)
- **Seat Assignments** - Passenger seat assignments
- **Ancillary Services** - Additional passenger services

## Development

### Running Tests

```bash
mvn test
```

### Code Quality

The project follows standard Java coding conventions and includes:

- Proper exception handling
- Input validation
- Logging
- Unit tests
- Integration tests

### API Testing

You can test the APIs using:

- **Postman** - Import the provided collection
- **cURL** - Use the examples in the module documentation
- **Swagger UI** - Available at `http://localhost:8084/swagger-ui.html` (if enabled)
# Airline Management System - Frontend

A modern React frontend application for an Airline Management System with role-based authentication and JWT token handling.

## Features

- **Role-based Authentication**: Separate dashboards for Admin and Staff users
- **JWT Token Management**: Secure authentication with token storage
- **Modern UI**: Built with Tailwind CSS for a beautiful, responsive design
- **Protected Routes**: Automatic redirection based on user roles
- **404 Error Handling**: Custom 404 page for invalid routes

## Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **JWT Decode** - JWT token handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Demo Credentials

### Admin User
- **Username**: admin
- **Password**: admin123
- **Access**: Full admin dashboard with system overview

### Staff User
- **Username**: staff
- **Password**: staff123
- **Access**: Staff dashboard with flight and task management

## Project Structure

```
src/
├── components/
│   ├── Login.jsx              # Login page with authentication
│   ├── AdminDashboard.jsx     # Admin dashboard component
│   ├── StaffDashboard.jsx     # Staff dashboard component
│   └── NotFound.jsx           # 404 error page
├── App.jsx                    # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles with Tailwind
```

## Features Breakdown

### Login Component
- Form validation
- Loading states
- Error handling
- JWT token storage
- Role-based redirection

### Admin Dashboard
- System statistics overview
- Recent activities feed
- Quick action buttons
- User management interface
- Revenue tracking

### Staff Dashboard
- Today's flight schedule
- Pending tasks management
- Customer service tools
- Flight status updates
- Task completion tracking

### 404 Page
- User-friendly error page
- Navigation back to login
- Decorative airline-themed elements

## Authentication Flow

1. User enters credentials on login page
2. System validates credentials (currently simulated)
3. JWT token is generated and stored in localStorage
4. User role is determined and stored
5. User is redirected to appropriate dashboard based on role
6. Protected routes check for valid token and role
7. Invalid access redirects to login or 404

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design for all screen sizes
- Modern gradient backgrounds
- Smooth hover animations
- Consistent color scheme
- Card-based layout design

## Future Enhancements

- Real API integration
- User profile management
- Advanced flight booking system
- Real-time notifications
- Dark mode support
- Multi-language support

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Airline Management System.

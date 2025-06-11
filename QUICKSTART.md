# Quick Start Guide

## Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### 1. Clone/Download the Project
The project consists of two main folders:
- `TaskManagerAPI/` - Backend ASP.NET Core API
- `TaskManagerUI/` - Frontend Angular application

### 2. Start the Backend API

```bash
# Navigate to the API directory
cd TaskManagerAPI

# Restore NuGet packages
dotnet restore

# Run the API (will create SQLite database automatically)
dotnet run
```

The API will be available at: http://localhost:5000
Swagger documentation: http://localhost:5000/swagger

### 3. Start the Frontend Application

```bash
# Navigate to the UI directory (in a new terminal)
cd TaskManagerUI

# Install npm packages
npm install

# Start the development server
ng serve
```

The application will be available at: http://localhost:4200

### 4. Login to the Application

Use one of the pre-seeded accounts:

**Admin Account:**
- Email: admin@taskmanager.com
- Password: admin123

**Regular User Account:**
- Email: john.doe@example.com
- Password: password123

### 5. Test the Application

1. **Login**: Use the credentials above to log in
2. **Dashboard**: View the main dashboard with task statistics
3. **Navigation**: Use the navbar to access different features
4. **User Menu**: Click the account icon to see user information and logout
5. **Task Management**: Use the "Create New Task" and "View All Tasks" buttons

## Troubleshooting

### Backend Issues
- Ensure .NET 8.0 SDK is installed
- Check if port 5000 is available
- Verify SQLite database is created in the project directory

### Frontend Issues
- Ensure Node.js 18+ is installed
- Run `npm install` if packages are missing
- Check if port 4200 is available
- Verify the backend API is running on port 5000

### CORS Issues
- The backend is configured to allow all origins for development
- Ensure both frontend and backend are running on their respective ports

## Project Structure
```
TaskManager/
├── TaskManagerAPI/          # Backend ASP.NET Core API
│   ├── Controllers/         # API controllers
│   ├── Models/             # Data models
│   ├── Services/           # Business logic
│   └── Data/               # Database context
├── TaskManagerUI/          # Frontend Angular app
│   └── src/app/
│       ├── components/     # UI components
│       ├── services/       # API services
│       └── models/         # TypeScript interfaces
└── README.md              # Full documentation
```

## Next Steps
- Explore the dashboard and task management features
- Test user registration with a new account
- Review the API documentation at /swagger
- Customize the application for your specific needs

For detailed documentation, see the main README.md file.


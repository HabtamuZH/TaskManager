# Task Manager - Project Documentation

## Overview
A complete task management web application built with ASP.NET Core API backend and Angular frontend, featuring user authentication, task CRUD operations, and a modern Material Design interface.

## Technologies Used

### Backend (ASP.NET Core API)
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: BCrypt
- **API Documentation**: Swagger/OpenAPI

### Frontend (Angular)
- **Framework**: Angular 18 with TypeScript
- **UI Library**: Angular Material
- **Styling**: SCSS with responsive design
- **Authentication**: JWT-based with route guards
- **HTTP Client**: Angular HttpClient with interceptors

## Project Structure

### Backend (`/TaskManagerAPI`)
```
TaskManagerAPI/
├── Controllers/
│   ├── AuthController.cs      # Authentication endpoints
│   └── TasksController.cs     # Task CRUD operations
├── Data/
│   └── TaskManagerDbContext.cs # Entity Framework context
├── DTOs/
│   ├── AuthDtos.cs           # Authentication data transfer objects
│   └── TaskDtos.cs           # Task data transfer objects
├── Models/
│   ├── User.cs               # User entity model
│   └── TaskItem.cs           # Task entity model
├── Services/
│   ├── AuthService.cs        # Authentication business logic
│   ├── JwtService.cs         # JWT token management
│   └── TaskService.cs        # Task business logic
├── Guards/
│   └── AuthGuard.cs          # Route protection
└── Program.cs                # Application configuration
```

### Frontend (`/TaskManagerUI`)
```
TaskManagerUI/src/app/
├── components/
│   ├── login/                # Login component
│   ├── register/             # Registration component
│   ├── dashboard/            # Main dashboard
│   ├── navbar/               # Navigation bar
│   ├── task-list/            # Task list component
│   └── task-form/            # Task form component
├── services/
│   ├── auth.ts               # Authentication service
│   └── api.ts                # API communication service
├── models/
│   ├── auth.model.ts         # Authentication interfaces
│   └── task.model.ts         # Task interfaces
├── guards/
│   └── auth-guard.ts         # Route protection
└── app.routes.ts             # Application routing
```

## Features Implemented

### Authentication System
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Password hashing with BCrypt
- ✅ Route protection with guards
- ✅ Token-based authentication
- ✅ User profile management

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Task status management (Pending, In Progress, Completed, Cancelled)
- ✅ Task priority levels (Low, Medium, High, Critical)
- ✅ Due date management
- ✅ Task filtering and search
- ✅ User-specific task isolation

### User Interface
- ✅ Responsive Material Design interface
- ✅ Login/Register forms with validation
- ✅ Dashboard with task statistics
- ✅ Navigation bar with user menu
- ✅ Task management interface
- ✅ Error handling and notifications

### Security Features
- ✅ JWT token authentication
- ✅ Password hashing
- ✅ CORS configuration
- ✅ Route guards
- ✅ Input validation
- ✅ SQL injection prevention

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### Tasks
- `GET /api/tasks` - Get user's tasks (with filtering)
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/status` - Update task status
- `GET /api/tasks/all` - Get all tasks (Admin only)

## Database Schema

### Users Table
- Id (Primary Key)
- FirstName
- LastName
- Email (Unique)
- PasswordHash
- Role (Admin/User)
- CreatedAt
- UpdatedAt

### Tasks Table
- Id (Primary Key)
- Title
- Description
- Status (Enum: Pending, InProgress, Completed, Cancelled)
- Priority (Enum: Low, Medium, High, Critical)
- DueDate (Optional)
- CreatedAt
- UpdatedAt
- UserId (Foreign Key)

## Default Users (Seeded)
1. **Admin User**
   - Email: admin@taskmanager.com
   - Password: admin123
   - Role: Admin

2. **Regular User**
   - Email: john.doe@example.com
   - Password: password123
   - Role: User

## Running the Application

### Backend (Port 5000)
```bash
cd TaskManagerAPI
dotnet restore
dotnet run
```

### Frontend (Port 4200)
```bash
cd TaskManagerUI
npm install
ng serve
```

### Access Points
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000
- **Swagger Documentation**: http://localhost:5000/swagger

## Testing Results
✅ Backend API successfully built and running
✅ Frontend application successfully built and running
✅ User authentication working (login/logout)
✅ JWT token generation and validation working
✅ Dashboard displaying user information correctly
✅ Navigation and routing working properly
✅ Material Design UI rendering correctly
✅ Responsive design working on different screen sizes

## Future Enhancements
- Task assignment to other users
- Task comments and attachments
- Email notifications
- Task categories and tags
- Advanced filtering and sorting
- Task templates
- Time tracking
- Reporting and analytics
- Mobile application
- Real-time updates with SignalR

## Security Considerations
- JWT tokens have expiration times
- Passwords are hashed using BCrypt
- CORS is configured for cross-origin requests
- Input validation on both client and server
- SQL injection prevention through Entity Framework
- Route guards protect authenticated routes

## Deployment Notes
- SQLite database file will be created automatically
- CORS is configured to allow all origins for development
- JWT secret key should be changed for production
- HTTPS should be enabled for production deployment
- Environment-specific configuration should be implemented


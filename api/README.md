
# Project Pulse API

This is a simple PHP API for the Project Pulse application. It provides endpoints for authentication, project management, and task management.

## Setup Instructions

1. Copy these files to your PHP server
2. Create a MySQL database named `project_pulse` (or update the .env file with your database name)
3. Import the database schema using the `database.sql` file
4. Update the `.env` file with your database credentials
5. Make sure your web server is configured to handle PHP files

## API Structure

The API consists of the following files:

- `config.php` - Database connection and utility functions
- `index.php` - API welcome page and documentation
- `login.php` - User authentication
- `signup.php` - User registration
- `projects.php` - Project management (list, create)
- `tasks.php` - Task management (list, create)
- `.env` - Environment configuration
- `database.sql` - Database schema

## API Endpoints

### Authentication

- `POST /login.php` - Login with email and password
- `POST /signup.php` - Register a new user

### Projects

- `GET /projects.php` - Get all projects for authenticated user
- `POST /projects.php` - Create a new project

### Tasks

- `GET /tasks.php?project_id={id}` - Get tasks for a specific project
- `POST /tasks.php` - Create a new task

## Response Format

All API endpoints return JSON responses in the following format:

```json
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

The API uses token-based authentication. After logging in, you'll receive a token that should be included in subsequent requests as a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Schema

The database consists of the following tables:

- `users` - User information
- `projects` - Project information
- `project_members` - Maps users to projects with roles
- `tasks` - Task information
- `task_comments` - Comments on tasks

See the `database.sql` file for the complete schema.

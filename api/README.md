
# Basic PHP API for Project Management

This directory contains basic PHP files that handle API requests from the React frontend.

## Setup Instructions

1. Place these PHP files in a web server directory (e.g., Apache, Nginx)
2. Make sure PHP is installed and configured
3. Set up a MySQL database for user and project data
4. Update the database connection details in `db_connect.php`

## Required PHP Files

You'll need to create the following PHP files:

### Database Connection
- `db_connect.php` - Contains database connection logic

### Authentication
- `register.php` - Handles user registration
- `login.php` - Handles user login and returns authentication token
- `logout.php` - Handles user logout
- `user.php` - Returns current user data
- `forgot-password.php` - Handles password reset requests
- `reset-password.php` - Processes password reset
- `update-password.php` - Updates user password

### Projects
- `projects.php` - Lists all projects
- `project.php` - Gets a single project by ID
- `project-create.php` - Creates a new project
- `project-tasks.php` - Lists tasks for a specific project

### Members
- `members.php` - Lists all members
- `add-project-member.php` - Adds a member to a project

### Tasks
- `create-task.php` - Creates a new task
- `update-task.php` - Updates an existing task

## API Response Format

All API endpoints should return JSON responses in the following format:

For successful responses:
```json
{
  "success": true,
  "data": { ... }
}
```

For error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

The API uses Bearer token authentication. The token should be included in the 
Authorization header of protected requests:

```
Authorization: Bearer <token>
```

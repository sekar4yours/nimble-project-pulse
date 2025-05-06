
# Project Management API

This is a Laravel-based RESTful API for the Project Management application.

## Setup Instructions

1. Clone the repository
2. Navigate to the API directory: `cd api`
3. Copy .env.example to .env: `cp .env.example .env`
4. Start Docker containers: `docker-compose up -d`
5. Enter the app container: `docker exec -it projectmanager-app bash`
6. Install dependencies: `composer install`
7. Generate application key: `php artisan key:generate`
8. Run migrations: `php artisan migrate`
9. (Optional) Seed the database: `php artisan db:seed`

## API Endpoints

### Projects
- GET /api/v1/projects - List all projects
- POST /api/v1/projects - Create a new project
- GET /api/v1/projects/{id} - Get a specific project
- PUT /api/v1/projects/{id} - Update a project
- DELETE /api/v1/projects/{id} - Delete a project
- GET /api/v1/projects/{id}/members - Get project members
- POST /api/v1/projects/{id}/members - Add member to project
- DELETE /api/v1/projects/{id}/members/{memberId} - Remove member from project
- GET /api/v1/projects/{id}/tasks - Get project tasks

### Members
- GET /api/v1/members - List all members
- POST /api/v1/members - Create a new member
- GET /api/v1/members/{id} - Get a specific member
- PUT /api/v1/members/{id} - Update a member
- DELETE /api/v1/members/{id} - Delete a member

### Tasks
- GET /api/v1/tasks - List all tasks
- POST /api/v1/tasks - Create a new task
- GET /api/v1/tasks/{id} - Get a specific task
- PUT /api/v1/tasks/{id} - Update a task
- DELETE /api/v1/tasks/{id} - Delete a task

## Integration with React Frontend

Example of connecting the React frontend to this API:

```typescript
// Example of fetching projects from the API
const fetchProjects = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/projects');
    const data = await response.json();
    if (data.status === 'success') {
      setProjects(data.data);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};
```

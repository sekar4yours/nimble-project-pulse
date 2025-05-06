
# Project Management Application

This is a full-stack project management application with a React frontend and Laravel backend.

## Project Structure

- `/` - React frontend
- `/api` - Laravel backend API

## Frontend Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

## Backend Setup

1. Navigate to API directory: `cd api`
2. Copy .env.example to .env: `cp .env.example .env`
3. Start Docker containers: `docker-compose up -d`
4. Enter the app container: `docker exec -it projectmanager-app bash`
5. Install dependencies: `composer install`
6. Generate application key: `php artisan key:generate`
7. Run migrations: `php artisan migrate`
8. (Optional) Seed database: `php artisan db:seed`

## API Endpoints

See `/api/README.md` for a full list of API endpoints.

## Quick Links

- Frontend: http://localhost:5173 (or your Vite default port)
- Backend API: http://localhost:8000/api/v1
- PHPMyAdmin: http://localhost:8080 (user: user, password: password)

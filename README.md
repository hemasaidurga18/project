# Hostel Room Booking Platform

A full-stack web application for booking hostel rooms, built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- User registration and login
- View available rooms
- Book rooms with check-in/check-out dates
- View and cancel bookings
- Admin panel to manage rooms

## Setup

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start MongoDB (ensure it's running on localhost:27017)
4. Start the server: `npm start` or `npm run dev`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the React app: `npm start`

The app will run on http://localhost:3000, and the backend on http://localhost:5000.

## Project Structure

- `backend/`: Node.js/Express server with MongoDB models and routes
- `frontend/`: React application with components for each page

## Technologies Used

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

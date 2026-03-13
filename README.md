# Real-time Book List Application

## Overview
This project implements real-time updates for a book list using WebSockets.  
Users can add books and see updates instantly across all connected clients without refreshing the page.

## Tech Stack
Frontend:
- React (Vite)
- Axios
- Socket.IO Client

Backend:
- Node.js
- Express
- Socket.IO

Deployment:
- Frontend hosted on Vercel
- Backend hosted on Render

## Real-time Technology
This application uses Socket.IO (WebSocket-based communication).

When a book is added or updated:
1. Backend emits an event
2. All connected clients receive the update
3. UI updates automatically

## Backend Implementation
The backend server uses Express and Socket.IO.

Key events:
- `bookAdded`
- `bookUpdated`


Apna Video Call – Backend
This is the backend server for Apna Video Call, a real-time video conferencing web application. It is built using Node.js, Express, and MongoDB, and handles user authentication, signaling for WebRTC connections, and various API endpoints.

🔧 Tech Stack
Node.js
Express
MongoDB & Mongoose
JWT Authentication (with Cookies)
WebRTC Signaling
Socket.IO

🚀 Features
User Signup & Login (with hashed passwords and secure JWT tokens)
WebRTC-based video calling logic with signaling via WebSockets
Real-time peer connections using Socket.IO
Secure cookie-based auth
Modular controller-route structure

📁 Folder Structure
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── util/
├── server.js
├── .env
├── package.json

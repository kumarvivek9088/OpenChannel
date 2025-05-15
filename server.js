const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active rooms
const rooms = {};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  // Join room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }
    
    // Add user to room
    rooms[roomId].users.push(socket.id);
    
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Notify room that a new user joined
    io.to(roomId).emit('userJoined', {
      userId: socket.id,
      userCount: rooms[roomId].users.length
    });
  });
  
  // Handle messages
  socket.on('sendMessage', (data) => {
    const { roomId, message } = data;
    
    // Send message to all users in the room
    io.to(roomId).emit('message', {
      userId: socket.id,
      message: message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.id);
      
      // Notify remaining users
      io.to(roomId).emit('userLeft', {
        userId: socket.id,
        userCount: rooms[roomId].users.length
      });
      
      // Clean up empty rooms
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`For network access use: http://<your-ip-address>:${PORT}`);
}); 
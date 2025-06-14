const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 10000;

// Store active rooms
const rooms = new Map();

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Wingspan WebRTC Signaling Server');
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create or join a room
  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joining room ${roomId}`);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    room.add(userId);
    
    // Join the socket.io room
    socket.join(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', userId);
    
    // Send list of existing users to the new participant
    const usersInRoom = Array.from(room).filter(id => id !== userId);
    socket.emit('existing-users', usersInRoom);
    
    // Handle WebRTC signaling
    socket.on('offer', (offer, targetUserId) => {
      socket.to(roomId).emit('offer', offer, userId, targetUserId);
    });
    
    socket.on('answer', (answer, targetUserId) => {
      socket.to(roomId).emit('answer', answer, userId, targetUserId);
    });
    
    socket.on('ice-candidate', (candidate, targetUserId) => {
      socket.to(roomId).emit('ice-candidate', candidate, userId, targetUserId);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.delete(userId);
        
        // Notify others that user has left
        socket.to(roomId).emit('user-disconnected', userId);
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

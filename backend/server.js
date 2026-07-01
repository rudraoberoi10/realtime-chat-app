/**
 * Entry point for the Chat App Backend.
 * Uses Express and Socket.io to handle real-time messaging.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // TODO: In production, restrict this to the specific app domain
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log(`[+] New client connected: ${socket.id}`);

    // Handle incoming messages
    socket.on('send_message', (data) => {
        // Basic validation: ensure empty messages aren't processed
        if (!data.text || !data.username) return;

        const formattedMessage = {
            id: Math.random().toString(36).substring(2, 9), // Simple unique ID generator
            username: data.username,
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Broadcast to all clients including the sender
        io.emit('receive_message', formattedMessage);
    });

    // Handle client disconnects gracefully
    socket.on('disconnect', () => {
        console.log(`[-] Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
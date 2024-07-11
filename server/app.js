import express from "express";
import http from "http";
import { sourceMapsEnabled } from "process";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.io server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Handle the connection event
const socketList = new Set();
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socketList.add(socket.id)
    io.emit("clients-total", socketList.size)

    socket.on("msg-from-client", (data) => {
        io.emit("broadcast-msg", data)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        socketList.delete(socket.id)
        io.emit("clients-total", socketList.size)
    });

    socket.on("feedback", (data) => {
        socket.broadcast.emit("is-typing", data)
    })
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

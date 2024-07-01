const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { PeerServer } = require('peer');

dotenv.config();
connectDB();
const app = express();

// Configure CORS
const allowedOrigins = ['http://localhost:5173', 'https://remote-work-tool.netlify.app/'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Set up PeerJS server
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 9000,
  path: process.env.PEER_PATH || '/peerjs',
  allow_discovery: true,
  proxied: true
});

peerServer.on('connection', (client) => {
  console.log('Peer client connected:', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('Peer client disconnected:', client.id);
});

peerServer.on('error', (error) => {
  console.error('Peer server error:', error);
});

// Set up Socket.io server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('chatMessage', (msg) => {
    console.log(`Received message: ${msg.text} from ${msg.sender}`);
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make the main server listen on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
  console.log(`PeerJS server running on port ${process.env.PEER_PORT || 9000}`);
});
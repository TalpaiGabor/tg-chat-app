const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const useragent = require('useragent');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

let users = {};
let messages = [];

// CORS middleware hozzáadása
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
  socket.on('join', ({ username }) => {
    const userId = uuidv4();
    const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    users[socket.id] = { username, userId, userColor, socketId: socket.id };
    io.emit('userList', Object.values(users));
    socket.emit('chatHistory', messages);
  });

  socket.on('message', (message) => {
    const user = users[socket.id];
    if (user) {
      const agent = useragent.parse(socket.handshake.headers['user-agent']);
      const userOs = agent.os.toString();
      const userBrowser = agent.toAgent();

      const fullMessage = {
        ...message,
        username: user.username,
        userId: user.userId,
        userColor: user.userColor,
        ip: socket.handshake.address,
        userAgent: `${userOs}~${userBrowser}`
      };
      messages.push(fullMessage);
      if (messages.length > 1024) messages.shift();
      io.emit('message', fullMessage);
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userList', Object.values(users));
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

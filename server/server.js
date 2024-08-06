const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Alapértelmezett útvonal
app.get('/', (req, res) => {
  res.send('Server is running');
});

let users = {};
let messages = [];

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', ({ username }) => {
    users[socket.id] = { username, userColor: getRandomColor() };
    io.emit('userList', Object.values(users));
    console.log(`${username} joined`);
  });

  socket.on('message', (message) => {
    const user = users[socket.id];
    if (user) {
      const msg = {
        ...message,
        username: user.username,
        userColor: user.userColor,
        ip: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent']
      };
      messages.push(msg);
      io.emit('message', msg);
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      console.log(`${user.username} disconnected`);
      delete users[socket.id];
      io.emit('userList', Object.values(users));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

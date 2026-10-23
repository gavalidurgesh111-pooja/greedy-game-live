const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Render का डायनामिक पोर्ट इस्तेमाल करें
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let timeLeft = 15;
let gameState = "BETTING";

setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    if (gameState === "BETTING") {
      gameState = "RESULT";
      timeLeft = 5;
      const winner = Math.floor(Math.random() * 8) + 1;
      io.emit("gameResult", { winner });
    } else {
      gameState = "BETTING";
      timeLeft = 15;
    }
  }
  io.emit("timerUpdate", { timeLeft, gameState });
}, 1000);

io.on('connection', (socket) => {
  socket.emit("timerUpdate", { timeLeft, gameState });
});

// 0.0.0.0 पर बाइंड करें ताकि Render तुरंत डिटेक्ट कर सके
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

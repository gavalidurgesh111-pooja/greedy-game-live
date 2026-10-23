const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 30 सेकंड का बेटिंग टाइमर
let timeLeft = 30;
let gameState = "BETTING";

setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    if (gameState === "BETTING") {
      gameState = "RESULT";
      timeLeft = 8; // रिजल्ट और लाइट घूमने के लिए समय
      const winner = Math.floor(Math.random() * 8) + 1;
      io.emit("gameResult", { winner });
    } else {
      gameState = "BETTING";
      timeLeft = 30; // अगला राउंड फिर 30 सेकंड
    }
  }
  io.emit("timerUpdate", { timeLeft, gameState });
}, 1000);

io.on('connection', (socket) => {
  socket.emit("timerUpdate", { timeLeft, gameState });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

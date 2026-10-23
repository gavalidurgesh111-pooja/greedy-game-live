const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let timeLeft = 15;
let gameState = "BETTING";

setInterval(() => {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    if (gameState === "BETTING") {
      gameState = "RESULT";
      const winningSpot = Math.floor(Math.random() * 8) + 1;
      io.emit('gameResult', { winner: winningSpot });
      timeLeft = 5;
    } else {
      gameState = "BETTING";
      timeLeft = 15;
    }
  }
  io.emit('timerUpdate', { timeLeft, gameState });
}, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

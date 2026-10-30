const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

let gameState = "BETTING";
let timeLeft = 30;

setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
        if (gameState === "BETTING") {
            gameState = "SPINNING";
            let winner = Math.floor(Math.random() * 8) + 1;
            io.emit("gameResult", { winner: winner });
            setTimeout(() => {
                gameState = "BETTING";
                timeLeft = 30;
            }, 4500);
        }
    }
    io.emit("timerUpdate", { gameState: gameState, timeLeft: timeLeft });
}, 1000);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/profile.html', (req, res) => {
  res.sendFile(__dirname + '/profile.html');
});
app.get('/profile-photo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile-photo.html'));
});

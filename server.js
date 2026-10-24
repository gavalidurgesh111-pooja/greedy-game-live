const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// सभी स्टैटिक फाइलों (HTML, CSS, JS) को लोड करने के लिए
app.use(express.static(__dirname));

// जब यूजर मुख्य लिंक पर आए तो index.html खुले
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// जब यूजर गेम पेज पर जाए तो game.html खुले
app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// गेम का टाइमर और रिजल्ट लॉजिक
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

// सर्वर पोर्ट सेट करना (Render के लिए जरूरी)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

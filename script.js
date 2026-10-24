const socket = io();
let isGameStarted = false;
let currentChatUser = { name: "User", avatar: "" };

const safeAvatars = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Warrior1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=King2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Queen3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Tiger4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Lion5",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Durgesh1"
];

let userId = localStorage.getItem("greedy_user_id") || ("#" + Math.floor(100000 + Math.random() * 900000));
let userName = localStorage.getItem("greedy_name") || "🦋DURGESH🦋";
let userLevel = parseInt(localStorage.getItem("greedy_level")) || 1;
let totalWon = parseInt(localStorage.getItem("greedy_won")) || 0;
let coins = parseInt(localStorage.getItem("greedy_coins")) || 10000;
let userFrame = localStorage.getItem("greedy_frame") || "none";
let userAvatar = localStorage.getItem("greedy_avatar") || safeAvatars[5];
let activeDays = parseInt(localStorage.getItem("greedy_days")) || 1;
let followersCount = parseInt(localStorage.getItem("greedy_followers")) || 142;
let followingCount = parseInt(localStorage.getItem("greedy_following")) || 35;
let isFollowed = localStorage.getItem("greedy_is_followed") === "true";

function initProfileUI() {
  if(document.getElementById("profId")) {
    document.getElementById("profId").innerText = userId;
    document.getElementById("profNameDisplay").innerText = userName;
    document.getElementById("profLevel").innerText = userLevel;
    document.getElementById("profWon").innerText = totalWon;
    document.getElementById("profBalance").innerText = coins;
    document.getElementById("profDays").innerText = activeDays;
    document.getElementById("profAvatarImg").src = userAvatar;
    document.getElementById("followersCount").innerText = followersCount;
    document.getElementById("followingCount").innerText = followingCount;
  }
}

function openMoreOptionsSheet() { document.getElementById("moreOptionsModal").style.display = "flex"; }
function closeMoreOptionsSheet() { document.getElementById("moreOptionsModal").style.display = "none"; }
function selectPhoneOption() { closeMoreOptionsSheet(); showScreenPhone(); }
function selectEmailOption() { closeMoreOptionsSheet(); alert("Email login coming soon!"); }
function socialLoginNotice(p) { alert(`${p} login selected. Use More Options.`); }

function showScreenPhone() {
  document.getElementById("screenMain").style.display = "none";
  document.getElementById("screenPhone").style.display = "flex";
}
function showScreenMain() {
  document.getElementById("screenPhone").style.display = "none";
  document.getElementById("screenMain").style.display = "flex";
}
function goToPassword() {
  let ph = document.getElementById("phoneInput").value;
  if(ph.length < 5) { alert("Enter valid phone number"); return; }
  document.getElementById("screenPhone").style.display = "none";
  document.getElementById("screenPass").style.display = "flex";
}
function doFinalLogin() {
  document.getElementById("loadingOverlay").style.display = "flex";
  setTimeout(() => {
    window.location.href = "game.html"; // सीधे अगले गेम पेज पर ले जाएगा
  }, 1000);
}

function enterGameFromProfile() {
  isGameStarted = true;
  document.getElementById("screenProfile").style.display = "none";
  document.getElementById("gameArea").style.display = "flex";
  document.body.classList.add("game-active");
  updateCoinsUI(coins);
}

function goBackToProfile() {
  document.body.classList.remove("game-active");
  if(document.getElementById("gameArea")) document.getElementById("gameArea").style.display = "none";
  if(document.getElementById("screenMessages")) document.getElementById("screenMessages").style.display = "none";
  if(document.getElementById("screenProfile")) document.getElementById("screenProfile").style.display = "flex";
  initProfileUI();
}

function openMessagesScreen() {
  document.getElementById("screenProfile").style.display = "none";
  document.getElementById("screenMessages").style.display = "flex";
}

function openChat(name, avatar) {
  currentChatUser = { name, avatar };
  document.getElementById("inboxUserName").innerText = name;
  document.getElementById("inboxUserAvatar").src = avatar;
  document.getElementById("screenMessages").style.display = "none";
  document.getElementById("screenInbox").style.display = "flex";
}
function closeChat() {
  document.getElementById("screenInbox").style.display = "none";
  document.getElementById("screenMessages").style.display = "flex";
}
function sendTextMessage() {
  let box = document.getElementById("chatInputBox");
  if(!box.value) return;
  let list = document.getElementById("inboxMessagesList");
  let bubble = document.createElement("div");
  bubble.className = "chat-bubble chat-outgoing";
  bubble.innerText = box.value;
  list.appendChild(bubble);
  box.value = "";
}

let selectedChip = 100;
let bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
let currentGameState = "BETTING";

function updateCoinsUI(amount) {
  coins = amount;
  localStorage.setItem("greedy_coins", coins);
  if(document.getElementById("coinsDisplay")) document.getElementById("coinsDisplay").innerText = coins;
  if(document.getElementById("profBalance")) document.getElementById("profBalance").innerText = coins;
}

function selectChip(amount, el) {
  selectedChip = amount;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
}

function placeBet(boxId) {
  if (currentGameState !== "BETTING") return;
  if (coins < selectedChip) return;
  updateCoinsUI(coins - selectedChip);
  bets[boxId] += selectedChip;
  document.getElementById("badge-" + boxId).style.display = "block";
  document.getElementById("badge-" + boxId).innerText = bets[boxId];
}

socket.on("timerUpdate", (data) => {
  currentGameState = data.gameState;
  const tDisp = document.getElementById("timerDisplay");
  if(tDisp) tDisp.innerText = data.gameState === "BETTING" ? `${data.timeLeft}s` : `⏳`;
});

socket.on("gameResult", (data) => {
  let currentHighlight = 1;
  let totalSteps = 24 + data.winner;
  function spinStep() {
    document.querySelectorAll(".item-card").forEach(c => c.classList.remove("highlight"));
    if(document.getElementById("card-" + currentHighlight)) document.getElementById("card-" + currentHighlight).classList.add("highlight");
    totalSteps--;
    currentHighlight = (currentHighlight % 8) + 1;
    if (totalSteps > 0) { setTimeout(spinStep, totalSteps < 10 ? 75 : 40); } 
    else {
      document.querySelectorAll(".item-card").forEach(c => c.classList.remove("highlight"));
      if(document.getElementById("card-" + data.winner)) document.getElementById("card-" + data.winner).classList.add("winner");
      let wonBet = bets[data.winner];
      if (wonBet > 0) {
        let wonAmount = wonBet * 4;
        updateCoinsUI(coins + wonAmount);
        totalWon += wonAmount;
        localStorage.setItem("greedy_won", totalWon);
      }
      setTimeout(() => {
        if(document.getElementById("card-" + data.winner)) document.getElementById("card-" + data.winner).classList.remove("winner");
        bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
        document.querySelectorAll(".my-bet-badge").forEach(b => { b.style.display = "none"; b.innerText = "0"; });
      }, 3500);
    }
  }
  if(isGameStarted) spinStep();
});

window.onload = () => { initProfileUI(); };

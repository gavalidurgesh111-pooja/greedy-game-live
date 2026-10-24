const socket = io();
let isGameStarted = false;

let coins = parseInt(localStorage.getItem("greedy_coins")) || 10050014452100;
let userName = localStorage.getItem("greedy_name") || "🦋DURGESH🦋";
let userLevel = parseInt(localStorage.getItem("greedy_level")) || 100;
let totalWon = parseInt(localStorage.getItem("greedy_won")) || 13937600;
let userFrame = localStorage.getItem("greedy_frame") || "none";
let followersCount = parseInt(localStorage.getItem("greedy_followers")) || 143;
let followingCount = parseInt(localStorage.getItem("greedy_following")) || 35;
let isFollowed = localStorage.getItem("greedy_is_followed") === "true";

function initProfileUI() {
  if(document.getElementById("profNameDisplay")) {
    document.getElementById("profNameDisplay").innerText = userName;
    document.getElementById("profBalance").innerText = coins;
    document.getElementById("coinsDisplay").innerText = coins;
    document.getElementById("profLevel").innerText = userLevel;
    document.getElementById("profWon").innerText = totalWon;
    document.getElementById("followersCount").innerText = followersCount;
    document.getElementById("followingCount").innerText = followingCount;
    
    const fBtn = document.getElementById("followBtn");
    if(fBtn) {
      fBtn.innerText = isFollowed ? "Following" : "+ Follow";
      fBtn.style.background = isFollowed ? "#555" : "linear-gradient(45deg, #8a2be2, #4a00e0)";
    }
    applyFrameUI(userFrame);
  }
}

function updateCoinsUI(amount) {
  coins = amount;
  localStorage.setItem("greedy_coins", coins);
  if(document.getElementById("coinsDisplay")) document.getElementById("coinsDisplay").innerText = coins;
  if(document.getElementById("profBalance")) document.getElementById("profBalance").innerText = coins;
}

function enterGameFromProfile() {
  isGameStarted = true;
  document.getElementById("screenProfile").style.display = "none";
  document.getElementById("gameArea").style.display = "flex";
  document.body.classList.add("game-active");
  updateCoinsUI(coins);
}

function goBackToProfile() {
  isGameStarted = false;
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

function clearRecentSearches() {
  document.getElementById("recentSearchesList").innerHTML = "<p style='font-size:12px; color:#888;'>No recent searches</p>";
}

function clearRecentViews() {
  document.getElementById("recentViewsList").innerHTML = "<p style='font-size:12px; color:#888;'>No recent views</p>";
}

let selectedChip = 100;
let bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
let currentGameState = "BETTING";

function selectChip(amount) {
  selectedChip = amount;
  alert("Selected chip: " + amount);
}

function placeBet(boxId) {
  if (currentGameState !== "BETTING") return;
  if (coins < selectedChip) { alert("Not enough coins!"); return; }
  updateCoinsUI(coins - selectedChip);
  bets[boxId] += selectedChip;
  let badge = document.getElementById("badge-" + boxId);
  if(badge) {
    badge.style.display = "block";
    badge.innerText = bets[boxId];
  }
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
    let card = document.getElementById("card-" + currentHighlight);
    if(card) card.classList.add("highlight");
    totalSteps--;
    currentHighlight = (currentHighlight % 8) + 1;
    if (totalSteps > 0) { 
      setTimeout(spinStep, totalSteps < 10 ? 75 : 40); 
    } else {
      document.querySelectorAll(".item-card").forEach(c => c.classList.remove("highlight"));
      let winCard = document.getElementById("card-" + data.winner);
      if(winCard) winCard.classList.add("winner");
      
      let wonBet = bets[data.winner];
      if (wonBet > 0) {
        let wonAmount = wonBet * 4;
        updateCoinsUI(coins + wonAmount);
        totalWon += wonAmount;
        localStorage.setItem("greedy_won", totalWon);
      }
      setTimeout(() => {
        if(winCard) winCard.classList.remove("winner");
        bets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
        document.querySelectorAll(".my-bet-badge").forEach(b => { b.style.display = "none"; b.innerText = "0"; });
      }, 3500);
    }
  }
  if(isGameStarted) spinStep();
});

function toggleFollow() {
  if (!isFollowed) { followersCount++; isFollowed = true; } else { followersCount--; isFollowed = false; }
  localStorage.setItem("greedy_followers", followersCount);
  localStorage.setItem("greedy_is_followed", isFollowed);
  initProfileUI();
}

function openEditProfile() {
  document.getElementById("nameInputEdit").value = userName;
  document.getElementById("modalEditProfile").style.display = "flex";
}
function closeEditProfile() { document.getElementById("modalEditProfile").style.display = "none"; }
function saveProfile() {
  userName = document.getElementById("nameInputEdit").value.trim() || "🦋DURGESH🦋";
  localStorage.setItem("greedy_name", userName);
  initProfileUI();
  closeEditProfile();
}

function openRecharge() { document.getElementById("modalRecharge").style.display = "flex"; }
function closeRecharge() { document.getElementById("modalRecharge").style.display = "none"; }
function processRecharge() {
  const val = parseInt(document.getElementById("rechargeInput").value);
  if(!val || val <= 0) { alert("Please enter valid coins"); return; }
  coins += val;
  userLevel += Math.floor(val / 100000) * 20;
  localStorage.setItem("greedy_coins", coins);
  localStorage.setItem("greedy_level", userLevel);
  initProfileUI();
  closeRecharge();
  alert(`Recharge Successful! Added ${val} coins.`);
}

function openFrames() { document.getElementById("modalFrames").style.display = "flex"; }
function closeFrames() { document.getElementById("modalFrames").style.display = "none"; }
function selectFrame(type) {
  userFrame = type;
  localStorage.setItem("greedy_frame", type);
  applyFrameUI(type);
  closeFrames();
}
function applyFrameUI(type) {
  const fr = document.getElementById("profAvatarFrame");
  if(fr) {
    fr.className = "avatar-frame";
    if(type === 'gold') fr.style.border = "3.5px solid #ffd700";
    else if(type === 'neon') fr.style.border = "3.5px solid #00f3ff";
    else fr.style.border = "3.5px solid transparent";
  }
}

function openLogoutScreen() {
  if(confirm("Are you sure you want to log out?")) {
    window.location.href = "index.html";
  }
}

window.onload = () => { initProfileUI(); };

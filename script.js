// LocalStorage Initial Setup for New User & Registration Defaults
if (!localStorage.getItem("greedy_initialized")) {
  localStorage.setItem("greedy_initialized", "true");
  localStorage.setItem("greedy_coins", "0");
  localStorage.setItem("greedy_won", "0");
  localStorage.setItem("greedy_level", "0");
  localStorage.setItem("greedy_name", "User_" + Math.floor(100000 + Math.random() * 900000));
  localStorage.setItem("greedy_unique_id", "#" + Math.floor(100000 + Math.random() * 900000));
  localStorage.setItem("greedy_privacy", "false");
  localStorage.setItem("greedy_frame", "neon-10");
}

let coins = parseInt(localStorage.getItem("greedy_coins")) || 0;
let userName = localStorage.getItem("greedy_name") || "User_677510";
let userId = localStorage.getItem("greedy_unique_id") || "#677510";
let userLevel = parseInt(localStorage.getItem("greedy_level")) || 0;
let totalWon = parseInt(localStorage.getItem("greedy_won")) || 0;
let isPrivate = localStorage.getItem("greedy_privacy") === "true";

function initProfile() {
  const nameDisplay = document.getElementById("profNameDisplay");
  if(nameDisplay) nameDisplay.innerText = userName;
  
  const balanceDisplay = document.getElementById("profBalance");
  if(balanceDisplay) balanceDisplay.innerText = coins;
  
  const wonDisplay = document.getElementById("profWon");
  if(wonDisplay) wonDisplay.innerText = totalWon;
  
  const levelDisplay = document.getElementById("profLevel");
  if(levelDisplay) levelDisplay.innerText = userLevel;
  
  const idDisplay = document.getElementById("profId");
  if(idDisplay) idDisplay.innerText = userId;
  
  const aboutIdDisplay = document.getElementById("aboutUserId");
  if(aboutIdDisplay) aboutIdDisplay.innerText = userId;
  
  updatePrivacyHeart();
}

function copyMyId() {
  navigator.clipboard.writeText(userId);
  alert("ID Copied: " + userId);
}

// Inbox Message Navigation
function openInboxMessage() {
  const inboxScreen = document.getElementById("screenInboxMessage");
  if(inboxScreen) inboxScreen.style.display = "flex";
  renderTopPlayers();
}
function closeInboxMessage() {
  const inboxScreen = document.getElementById("screenInboxMessage");
  if(inboxScreen) inboxScreen.style.display = "none";
}

// About Me Navigation & Privacy Toggle (Heart Button)
function openAboutMeScreen() {
  const aboutScreen = document.getElementById("screenAboutMe");
  if(aboutScreen) aboutScreen.style.display = "flex";
}
function closeAboutMeScreen() {
  const aboutScreen = document.getElementById("screenAboutMe");
  if(aboutScreen) aboutScreen.style.display = "none";
}
function togglePrivacy() {
  isPrivate = !isPrivate;
  localStorage.setItem("greedy_privacy", isPrivate);
  updatePrivacyHeart();
}
function updatePrivacyHeart() {
  const heart = document.getElementById("privacyHeart");
  const bioBox = document.getElementById("aboutMeContentBox");
  if(!heart || !bioBox) return;
  
  if(isPrivate) {
    heart.innerText = "❤️";
    bioBox.style.background = "#ffe6e6";
    bioBox.innerHTML = "<h4>Bio & Details</h4><p style='font-size:13px; color:#d9534f; font-weight:bold;'>🔒 Private Mode Active: This profile info is hidden from other users.</p>";
  } else {
    heart.innerText = "🤍";
    bioBox.style.background = "#fff";
    bioBox.innerHTML = "<h4>Bio & Details</h4><p style='font-size:13px; color:#555;'>This is your personal profile bio. Tap the heart icon (🤍/❤️) at the top right to set privacy.</p>";
  }
}

// Groups Navigation
function openGroupsScreen() { 
  const groupScreen = document.getElementById("screenGroups");
  if(groupScreen) groupScreen.style.display = "flex"; 
}
function closeGroupsScreen() { 
  const groupScreen = document.getElementById("screenGroups");
  if(groupScreen) groupScreen.style.display = "none"; 
}

// Coin Send Feature
function openCoinSendModal() { 
  const modal = document.getElementById("modalCoinSend");
  if(modal) modal.style.display = "flex"; 
}
function closeCoinSendModal() { 
  const modal = document.getElementById("modalCoinSend");
  if(modal) modal.style.display = "none"; 
}
function processCoinSend() {
  let targetIdInput = document.getElementById("targetUserId");
  let amtInput = document.getElementById("sendCoinAmount");
  if(!targetIdInput || !amtInput) return;

  let targetId = targetIdInput.value.trim();
  let amt = parseInt(amtInput.value);
  if(!targetId) { alert("Please enter receiver ID"); return; }
  if(!amt || amt <= 0 || amt > coins) { alert("Invalid coin amount or insufficient balance!"); return; }
  
  coins -= amt;
  localStorage.setItem("greedy_coins", coins);
  initProfile();
  closeCoinSendModal();
  alert(`Successfully sent ${amt} coins to ${targetId}!`);
}

// Settings Modal
function openSettingsModal() { 
  const modal = document.getElementById("modalSettings");
  if(modal) modal.style.display = "flex"; 
}
function closeSettingsModal() { 
  const modal = document.getElementById("modalSettings");
  if(modal) modal.style.display = "none"; 
}

function clearSearches() { 
  const list = document.getElementById("recentSearchesList");
  if(list) list.innerText = "No recent searches"; 
}
function clearViews() { 
  const list = document.getElementById("recentViewsList");
  if(list) list.innerText = "No recent views"; 
}

function renderTopPlayers() {
  const container = document.getElementById("topPlayersContainer");
  if(!container) return;
  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px; background:#f9f9f9; border-radius:8px;">
      <span style="font-weight:bold; font-size:13px;">👑 KingRahul (#102938)</span>
      <span style="color:#e65100; font-weight:bold; font-size:12px;">🪙 450,000</span>
    </div>
    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px; background:#f9f9f9; border-radius:8px;">
      <span style="font-weight:bold; font-size:13px;">🔥 TigerBoss (#554433)</span>
      <span style="color:#e65100; font-weight:bold; font-size:12px;">🪙 280,000</span>
    </div>
  `;
}

// Edit Profile Name Feature
function openEditProfile() {
  let newName = prompt("Enter new profile name:", userName);
  if(newName && newName.trim() !== "") {
    userName = newName.trim();
    localStorage.setItem("greedy_name", userName);
    initProfile();
  }
}

window.onload = () => { 
  initProfile(); 
};

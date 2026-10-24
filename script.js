let coins = parseInt(localStorage.getItem("greedy_coins")) || 10050014452100;
let userName = localStorage.getItem("greedy_name") || "🦋DURGESH🦋";
let userLevel = parseInt(localStorage.getItem("greedy_level")) || 100;
let userFrame = localStorage.getItem("greedy_frame") || "none";
let followersCount = parseInt(localStorage.getItem("greedy_followers")) || 143;
let isFollowed = localStorage.getItem("greedy_is_followed") === "true";

function initProfileUI() {
  if(document.getElementById("profNameDisplay")) {
    document.getElementById("profNameDisplay").innerText = userName;
    document.getElementById("profBalance").innerText = coins;
    document.getElementById("coinsDisplay").innerText = coins;
    document.getElementById("profLevel").innerText = userLevel;
    document.getElementById("followersCount").innerText = followersCount;
    
    const fBtn = document.getElementById("followBtn");
    if(fBtn) {
      fBtn.innerText = isFollowed ? "Following" : "+ Follow";
      fBtn.style.background = isFollowed ? "#555" : "linear-gradient(45deg, #8a2be2, #4a00e0)";
    }
    applyFrameUI(userFrame);
  }
}

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

function enterGameFromProfile() {
  document.getElementById("screenProfile").style.display = "none";
  document.getElementById("gameArea").style.display = "flex";
  document.body.classList.add("game-active");
}

function goBackToProfile() {
  document.body.classList.remove("game-active");
  document.getElementById("gameArea").style.display = "none";
  document.getElementById("screenProfile").style.display = "flex";
  initProfileUI();
}

function openLogoutScreen() {
  if(confirm("Are you sure you want to log out?")) {
    window.location.href = "index.html";
  }
}

window.onload = () => {
  initProfileUI();
};

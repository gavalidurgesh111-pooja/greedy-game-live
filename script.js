let coins = parseInt(localStorage.getItem("greedy_coins")) || 10050014452100;
let userName = localStorage.getItem("greedy_name") || "🦋DURGESH🦋";
let userLevel = parseInt(localStorage.getItem("greedy_level")) || 100;
let userFrame = localStorage.getItem("greedy_frame") || "none";
let followersCount = parseInt(localStorage.getItem("greedy_followers")) || 143;
let isFollowed = localStorage.getItem("greedy_is_followed") === "true";

let allGamePlayers = [
  { name: "👑 KingRahul", id: "#102938", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=King2", won: 450000 },
  { name: "🔥 TigerBoss", id: "#554433", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Tiger4", won: 280000 },
  { name: "⚡ QueenRuby", id: "#998877", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Queen3", won: 195000 },
  { name: "🌟 WarriorX", id: "#112233", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Warrior1", won: 92000 }
];

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

function openInboxMessagePage() {
  document.getElementById("screenProfile").style.display = "none";
  document.getElementById("screenInboxMessage").style.display = "flex";
  renderAllPlayersList();
}

function closeInboxMessagePage() {
  document.getElementById("screenInboxMessage").style.display = "none";
  document.getElementById("screenProfile").style.display = "flex";
}

function clearRecentSearches() {
  document.getElementById("recentSearchesList").innerHTML = "<p style='font-size:12px; color:#888; padding:5px;'>No recent searches</p>";
}

function clearRecentViews() {
  document.getElementById("recentViewsList").innerHTML = "<p style='font-size:12px; color:#888; padding:5px;'>No recent views</p>";
}

function visitUserProfile(name, id, avatar) {
  alert(`Visiting profile: ${name} (${id})`);
}

function renderAllPlayersList() {
  const container = document.getElementById("allPlayersListContainer");
  if(!container) return;
  container.innerHTML = "";
  allGamePlayers.forEach(player => {
    let item = document.createElement("div");
    item.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:#fafafa; border-radius:12px; cursor:pointer; border:1px solid #eee;";
    item.onclick = () => visitUserProfile(player.name, player.id, player.avatar);
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${player.avatar}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:1.5px solid #ffd700;">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span style="font-size:14px; font-weight:900; color:#111;">${player.name}</span>
          <span style="font-size:11px; color:#666; font-weight:bold;">ID: ${player.id}</span>
        </div>
      </div>
      <div style="font-size:13px; font-weight:900; color:#e65100; background:#fff3e0; padding:4px 10px; border-radius:12px;">🪙 ${player.won.toLocaleString()}</div>
    `;
    container.appendChild(item);
  });
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

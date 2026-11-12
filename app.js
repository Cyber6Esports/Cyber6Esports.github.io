/* ============================================================================
   CYBER 6 ESPORTS [C6E] — PRO APPLICATION LOGIC + ПАНТЕОН (900 GOLD) + C6E SHIELD
   ============================================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, onSnapshot, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Встраиваем стили Двойного Таба + Карусели Состава + ПАНТЕОНА [C6E] + C6E Shield
const c6eProStyles = document.createElement('style');
c6eProStyles.innerHTML = `
  /* Двойной Таб Standoff 2 */
  .so2-tab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 12px; }
  .so2-team-panel { background: linear-gradient(180deg, rgba(24, 22, 24, 0.95) 0%, rgba(12, 12, 15, 0.98) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6); }
  .so2-team-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; font-family: var(--font-tech); font-size: 11px; font-weight: 800; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
  .so2-team-header.c6e-head { background: linear-gradient(90deg, rgba(158, 27, 40, 0.35), rgba(20, 21, 26, 0.9)); border-left: 3px solid var(--accent-light); }
  .so2-team-header.enemy-head { background: linear-gradient(90deg, rgba(70, 130, 210, 0.25), rgba(20, 21, 26, 0.9)); border-left: 3px solid #5ea8ff; }
  .so2-table-wrap { width: 100%; overflow-x: auto; }
  .so2-table { width: 100%; border-collapse: collapse; font-size: 11px; min-width: 310px; }
  .so2-table th { color: #8b8e96; font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 7px 5px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: rgba(0, 0, 0, 0.35); }
  .so2-table th.col-name { text-align: left; padding-left: 10px; }
  .so2-table td { padding: 8px 5px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.04); color: #dcdcdc; font-weight: 600; }
  .so2-table tr:nth-child(1) td { background: rgba(255, 255, 255, 0.03); }
  .so2-table td.col-name { text-align: left; padding-left: 8px; white-space: nowrap; font-weight: 700; color: #ffffff; }
  .tag-c6e { display: inline-block; background: rgba(158, 27, 40, 0.35); border: 1px solid var(--accent-light); color: #ffffff; font-family: var(--font-tech); font-size: 9px; padding: 1px 5px; border-radius: 4px; margin-right: 4px; }
  .tag-clan { display: inline-block; background: rgba(94, 168, 255, 0.16); border: 1px solid rgba(94, 168, 255, 0.4); color: #9ec8ff; font-family: var(--font-tech); font-size: 9px; padding: 1px 5px; border-radius: 4px; margin-right: 4px; }
  .so2-bottom-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; padding: 8px 12px; background: rgba(0, 0, 0, 0.45); border-radius: 6px; font-size: 10px; color: var(--silver-muted); border: 1px solid rgba(255, 255, 255, 0.05); }
  .mvp-compare-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 12px; }
  .mvp-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 9px 12px; display: flex; align-items: center; gap: 10px; font-size: 11px; }
  .chip-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); color: var(--silver); font-family: var(--font-tech); font-size: 10px; padding: 5px 10px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
  .chip-btn:hover { background: var(--accent); color: #fff; border-color: var(--silver); }

  /* =========================================================
     ПАНТЕОН [C6E] — ЕЖЕНЕДЕЛЬНАЯ ГОНКА ЗА 900 ГОЛДЫ ОТ ОСНОВАТЕЛЯ
     ========================================================= */
  .pantheon-hero {
    background: linear-gradient(145deg, rgba(34, 24, 12, 0.94) 0%, rgba(16, 17, 22, 0.98) 55%, rgba(158, 27, 40, 0.22) 100%);
    border: 1px solid rgba(255, 179, 0, 0.4);
    border-top: 3px solid #ffb300;
    border-radius: 18px; padding: 22px 18px; margin-bottom: 18px;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 179, 0, 0.12);
    position: relative; overflow: hidden; text-align: center;
  }
  .pantheon-badge-top {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255, 179, 0, 0.14); border: 1px solid rgba(255, 179, 0, 0.45);
    color: #ffb300; font-family: var(--font-tech); font-size: 9px; font-weight: 800;
    padding: 4px 12px; border-radius: 20px; letter-spacing: 1.5px; margin-bottom: 8px;
  }
  .pantheon-title {
    font-family: var(--font-tech); font-size: clamp(24px, 6vw, 34px); font-weight: 900;
    color: #fff; letter-spacing: 3px; margin: 0 0 6px 0;
    text-shadow: 0 0 18px rgba(255, 179, 0, 0.35);
  }
  .pantheon-title span { color: #ffb300; }
  .pantheon-prize-strip {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    max-width: 560px; margin: 14px auto 12px auto;
  }
  .prize-tier-box {
    background: rgba(0, 0, 0, 0.55); border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px; padding: 10px 6px; position: relative;
  }
  .prize-tier-box.gold { border-color: #ffb300; background: linear-gradient(180deg, rgba(255, 179, 0, 0.18), rgba(0,0,0,0.65)); box-shadow: 0 0 16px rgba(255, 179, 0, 0.2); }
  .prize-tier-box.silver { border-color: #e4e4e2; background: linear-gradient(180deg, rgba(228, 228, 226, 0.12), rgba(0,0,0,0.65)); }
  .prize-tier-box.bronze { border-color: #cd7f32; background: linear-gradient(180deg, rgba(205, 127, 50, 0.14), rgba(0,0,0,0.65)); }
  .prize-gold-amount { font-family: var(--font-tech); font-size: 15px; font-weight: 900; color: #fff; }
  .prize-gold-lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; color: var(--silver-muted); margin-top: 2px; }

  .podium-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; margin-bottom: 18px;
  }
  .podium-card {
    background: linear-gradient(165deg, rgba(24, 25, 32, 0.96) 0%, rgba(10, 11, 15, 0.99) 100%);
    border: 1px solid var(--glass-border); border-radius: 16px; padding: 16px;
    position: relative; overflow: hidden; box-shadow: 0 14px 32px rgba(0,0,0,0.75);
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .podium-card.rank-1 { border: 2px solid #ffb300; box-shadow: 0 0 28px rgba(255, 179, 0, 0.25); }
  .podium-card.rank-2 { border: 1.5px solid #e4e4e2; }
  .podium-card.rank-3 { border: 1.5px solid #cd7f32; }

  .pts-bar-bg {
    width: 100%; height: 7px; background: rgba(255,255,255,0.07);
    border-radius: 10px; overflow: hidden; margin: 8px 0;
  }
  .pts-bar-fill {
    height: 100%; border-radius: 10px;
    background: linear-gradient(90deg, var(--accent-light), #ffb300);
    transition: width 0.5s ease;
  }
  .boost-btn {
    width: 100%; padding: 9px 12px; border-radius: 9px;
    background: linear-gradient(135deg, rgba(255, 179, 0, 0.18), rgba(158, 27, 40, 0.35));
    border: 1px solid #ffb300; color: #fff;
    font-family: var(--font-tech); font-size: 10px; font-weight: 800;
    cursor: pointer; transition: 0.25s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .boost-btn:hover, .boost-btn:active {
    background: linear-gradient(135deg, #ffb300, #d42638);
    color: #000; box-shadow: 0 0 16px rgba(255, 179, 0, 0.5);
  }

  /* =========================================================
     ВИТРИНА СОСТАВА НА 1 ЭКРАН (БЕЗ СКРОЛЛА ВВЕРХ-ВНИЗ!)
     ========================================================= */
  .roster-hub-controls {
    display: flex; justify-content: space-between; align-items: center;
    gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
    background: rgba(18, 19, 24, 0.9); border: 1px solid var(--glass-border);
    padding: 8px 10px; border-radius: 12px;
  }
  .squad-tabs { display: flex; gap: 6px; flex: 1; }
  .squad-tab-btn {
    flex: 1; padding: 9px 10px; border-radius: 8px; border: 1px solid var(--glass-border);
    background: rgba(255, 255, 255, 0.03); color: var(--silver-muted);
    font-family: var(--font-tech); font-size: 10px; font-weight: 700;
    cursor: pointer; transition: 0.25s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .squad-tab-btn.active {
    background: linear-gradient(135deg, var(--accent), #5c0d15);
    color: #fff; border-color: var(--silver);
    box-shadow: 0 4px 14px var(--accent-glow);
  }
  .report-mini-btn {
    padding: 9px 12px; border-radius: 8px; border: 1px solid var(--accent-light);
    background: var(--accent-dim); color: #fff; font-family: var(--font-tech);
    font-size: 9px; font-weight: 800; cursor: pointer; white-space: nowrap;
    display: flex; align-items: center; gap: 6px; transition: 0.25s;
  }
  .report-mini-btn:hover { background: var(--accent-light); }

  .player-selector-bar {
    display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 10px 2px;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .player-selector-bar::-webkit-scrollbar { display: none; }
  .player-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 12px 6px 6px; border-radius: 30px;
    background: rgba(18, 19, 24, 0.9); border: 1px solid var(--glass-border);
    cursor: pointer; white-space: nowrap; transition: 0.25s; flex-shrink: 0;
  }
  .player-chip img {
    width: 28px; height: 28px; border-radius: 50%; object-fit: cover;
    border: 1px solid var(--silver-border);
  }
  .player-chip-nick { font-family: var(--font-tech); font-size: 10px; color: var(--silver); font-weight: 700; }
  .player-chip-kd { font-family: var(--font-tech); font-size: 9px; padding: 2px 5px; border-radius: 10px; background: rgba(0,230,118,0.12); color: var(--success); font-weight: 800; }
  .player-chip.active {
    background: linear-gradient(90deg, rgba(158, 27, 40, 0.4), rgba(24, 25, 32, 0.98));
    border-color: var(--accent-light);
    box-shadow: 0 4px 15px var(--accent-dim);
    transform: translateY(-1px);
  }
  .player-chip.active .player-chip-nick { color: #fff; }

  .roster-carousel-wrap { position: relative; width: 100%; }
  .roster-swipe-track {
    display: flex; gap: 16px; overflow-x: auto;
    scroll-snap-type: x mandatory; scroll-behavior: smooth;
    padding: 4px 2px 12px 2px;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .roster-swipe-track::-webkit-scrollbar { display: none; }

  .pro-player-card {
    flex: 0 0 100%;
    max-width: 440px;
    margin: 0 auto;
    scroll-snap-align: center;
    background: linear-gradient(165deg, rgba(22, 23, 29, 0.96) 0%, rgba(10, 11, 14, 0.99) 100%);
    border: 1px solid var(--silver-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.8);
    display: flex; flex-direction: column;
  }

  .pro-card-top {
    position: relative;
    height: 195px;
    overflow: hidden;
    background: #08090c;
  }
  .pro-card-avatar {
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0.82; filter: contrast(108%);
  }
  .pro-card-shade {
    position: absolute; inset: 0;
    background: linear-gradient(to top, #0c0d11 4%, rgba(12, 13, 17, 0.5) 50%, transparent 100%);
  }
  .pro-badges-row {
    position: absolute; top: 10px; left: 12px; right: 12px;
    display: flex; justify-content: space-between; align-items: center; z-index: 2;
  }
  .pro-role-badge {
    font-family: var(--font-tech); font-size: 9px; font-weight: 800;
    color: #fff; background: rgba(14, 15, 19, 0.85);
    border: 1px solid var(--silver-border); border-left: 3px solid var(--accent-light);
    padding: 4px 9px; border-radius: 5px; letter-spacing: 1.5px; text-transform: uppercase;
  }
  .pro-form-badge {
    font-family: var(--font-tech); font-size: 9px; font-weight: 800;
    padding: 4px 8px; border-radius: 5px; letter-spacing: 0.8px;
    backdrop-filter: blur(8px);
  }
  .form-fire { background: rgba(0, 230, 118, 0.16); border: 1px solid rgba(0, 230, 118, 0.45); color: #00e676; }
  .form-stable { background: rgba(228, 228, 226, 0.12); border: 1px solid rgba(228, 228, 226, 0.3); color: var(--silver); }
  .form-cold { background: rgba(212, 38, 56, 0.18); border: 1px solid rgba(212, 38, 56, 0.45); color: #ff5c6c; }

  .pro-identity {
    position: absolute; bottom: 8px; left: 14px; right: 14px; z-index: 2;
  }
  .pro-nick {
    font-family: var(--font-tech); font-size: 20px; font-weight: 900;
    color: #fff; margin: 0; letter-spacing: 1px;
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .pro-quote {
    font-size: 10px; color: var(--silver-muted); font-style: italic;
    margin-top: 3px; border-left: 2px solid var(--accent-light); padding-left: 8px;
  }

  .pro-card-body {
    padding: 12px 14px 14px 14px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .pro-metrics-grid {
    display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 6px;
    background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px; padding: 9px 6px;
  }
  .pro-metric-box { text-align: center; display: flex; flex-direction: column; justify-content: center; }
  .pro-metric-val { font-family: var(--font-tech); font-size: 15px; font-weight: 800; color: #fff; display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; }
  .pro-metric-lbl { font-size: 8px; color: var(--silver-muted); text-transform: uppercase; margin-top: 2px; font-weight: 700; }
  .kd-delta { font-size: 9px; font-family: var(--font-tech); font-weight: 800; padding: 1px 4px; border-radius: 4px; }
  .delta-up { color: #00e676; background: rgba(0, 230, 118, 0.12); }
  .delta-down { color: #ff5263; background: rgba(212, 38, 56, 0.16); }
  .delta-neutral { color: var(--silver-muted); background: rgba(255,255,255,0.06); }

  .pro-recent-strip {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px; padding: 6px 10px; font-size: 10px;
  }
  .recent-dots { display: flex; gap: 4px; align-items: center; }
  .recent-pill { font-family: var(--font-tech); font-size: 8px; font-weight: 700; padding: 2px 5px; border-radius: 4px; }
  .recent-pill.good { background: rgba(0, 230, 118, 0.15); color: #00e676; border: 1px solid rgba(0,230,118,0.3); }
  .recent-pill.bad { background: rgba(212, 38, 56, 0.15); color: #ff5c6c; border: 1px solid rgba(212,38,56,0.3); }

  .pro-specs-compact {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
    background: rgba(255,255,255,0.02); border-radius: 8px; padding: 7px 8px;
    border: 1px solid rgba(255,255,255,0.04); text-align: center;
  }
  .spec-mini-lbl { font-size: 7px; color: var(--silver-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .spec-mini-val { font-size: 10px; font-weight: 700; color: var(--silver); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .carousel-nav-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 2px; padding: 0 4px;
  }
  .carousel-arrow-btn {
    background: rgba(255,255,255,0.05); border: 1px solid var(--silver-border);
    color: var(--silver); width: 36px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: 0.2s;
  }
  .carousel-arrow-btn:active, .carousel-arrow-btn:hover { background: var(--accent); color: #fff; }

  #c6e-analytics-modal {
    position: fixed; inset: 0; z-index: 11500;
    background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(12px);
    display: none; align-items: center; justify-content: center; padding: 14px;
  }
  #c6e-analytics-modal.active { display: flex; }
  .analytics-modal-box {
    width: min(96vw, 780px); max-height: 88vh; overflow-y: auto;
    background: linear-gradient(180deg, #15161c 0%, #0b0c0f 100%);
    border: 1px solid var(--silver-border); border-top: 3px solid var(--accent-light);
    border-radius: 16px; padding: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.95);
    position: relative;
  }

  /* ЭКРАН БЛОКИРОВКИ ВРЕДИТЕЛЯ (C6E SHIELD BAN OVERLAY) */
  #c6e-ban-overlay {
    position: fixed; inset: 0; z-index: 99999;
    background: radial-gradient(circle at 50% 35%, rgba(158, 27, 40, 0.35) 0%, #07080a 70%);
    backdrop-filter: blur(18px);
    display: none; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px; text-align: center;
  }
  #c6e-ban-overlay.active { display: flex; }
  .ban-card-box {
    max-width: 440px; width: 100%;
    background: rgba(16, 17, 22, 0.96);
    border: 2px solid var(--accent-light);
    border-radius: 18px; padding: 30px 22px;
    box-shadow: 0 0 50px rgba(212, 38, 56, 0.45);
  }
`;
document.head.appendChild(c6eProStyles);

const analyticsModal = document.createElement('div');
analyticsModal.id = 'c6e-analytics-modal';
analyticsModal.onclick = (e) => { if (e.target === analyticsModal) closeAnalyticsModal(); };
analyticsModal.innerHTML = `<div class="analytics-modal-box" id="c6e-analytics-content"></div>`;
document.body.appendChild(analyticsModal);

const banOverlay = document.createElement('div');
banOverlay.id = 'c6e-ban-overlay';
document.body.appendChild(banOverlay);

window.closeAnalyticsModal = () => {
  document.getElementById('c6e-analytics-modal').classList.remove('active');
};

// 1. ТЕЛЕГРАМ КОНФИГ (ТОКЕН СКРЫТ ОТ GITHUB И ПОДГРУЖАЕТСЯ ИЗ БАЗЫ FIREBASE)
const TG_CONFIG = {
  token: "",
  channelId: "-1004428385527",
  groupId: "-1004452371581"
};

const SECRET_SALT = "C6E_PRO_SHIELD_2026";
function decodeBotToken(enc) {
  if (!enc) return "";
  try {
    const rev = enc.split("").reverse().join("");
    const xored = decodeURIComponent(escape(atob(rev)));
    let orig = "";
    for (let i = 0; i < xored.length; i++) {
      orig += String.fromCharCode(xored.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length));
    }
    return orig.trim();
  } catch (e) {
    return "";
  }
}

// 2. FIREBASE КОНФИГ
const firebaseConfig = {
  apiKey: "AIzaSyDVFYaxAtzEi5zF8yi_ORJQYL66wQa-gpE",
  authDomain: "airexsite.firebaseapp.com",
  projectId: "airexsite",
  storageBucket: "airexsite.firebasestorage.app",
  messagingSenderId: "276640665598",
  appId: "1:276640665598:web:d7400bd5962995efb43aaf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DB_COLLECTION = "siteData";

// =========================================================================
// СИСТЕМА БЕЗОПАСНОСТИ C6E SHIELD (FINGERPRINT + IP + BANS + LOGS)
// =========================================================================

function getOrCreateDeviceId() {
  let devId = localStorage.getItem('c6e_shield_device_id');
  if (!devId) {
    const rawSig = [
      navigator.userAgent || '',
      navigator.language || '',
      screen.width + 'x' + screen.height,
      navigator.hardwareConcurrency || 4,
      Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    ].join('|');
    let hash = 0;
    for (let i = 0; i < rawSig.length; i++) {
      hash = ((hash << 5) - hash) + rawSig.charCodeAt(i);
      hash |= 0;
    }
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    devId = `C6E-${Math.abs(hash).toString(16).toUpperCase().slice(0, 6)}-${randSuffix}`;
    localStorage.setItem('c6e_shield_device_id', devId);
  }
  return devId;
}

function getReadableDeviceInfo() {
  const ua = navigator.userAgent || '';
  let os = 'Device';
  if (/android/i.test(ua)) {
    const m = ua.match(/Android\s([0-9.]+);\s([^;)]+)/i);
    os = m ? `Android ${m[1]} (${m[2].trim()})` : 'Android Phone';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS (iPhone/iPad)';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows PC';
  } else if (/Mac/i.test(ua)) {
    os = 'MacOS';
  }
  return `${os} [${screen.width}x${screen.height}]`;
}

let clientSecurityMeta = {
  deviceId: getOrCreateDeviceId(),
  ip: 'Определяется...',
  deviceInfo: getReadableDeviceInfo(),
  isBanned: false,
  banReason: ''
};

let globalBannedList = [];

async function resolveClientIp() {
  if (clientSecurityMeta.ip && clientSecurityMeta.ip !== 'Определяется...') return clientSecurityMeta.ip;
  const endpoints = [
    'https://api.ipify.org?format=json',
    'https://api64.ipify.org?format=json',
    'https://ipwho.is/'
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          clientSecurityMeta.ip = data.ip;
          checkIfCurrentUserBanned();
          return data.ip;
        }
      }
    } catch (e) {}
  }
  clientSecurityMeta.ip = 'Скрыт / VPN';
  return clientSecurityMeta.ip;
}

resolveClientIp();

function checkIfCurrentUserBanned() {
  const myDev = clientSecurityMeta.deviceId;
  const myIp = clientSecurityMeta.ip;

  const foundBan = globalBannedList.find(b =>
    (b.deviceId && b.deviceId === myDev) ||
    (b.ip && b.ip !== 'Скрыт / VPN' && b.ip !== 'Определяется...' && b.ip === myIp)
  );

  const overlay = document.getElementById('c6e-ban-overlay');
  if (foundBan) {
    clientSecurityMeta.isBanned = true;
    clientSecurityMeta.banReason = foundBan.reason || 'Спам / Нарушение правил портала [C6E]';
    if (overlay) {
      overlay.innerHTML = `
        <div class="ban-card-box">
          <div style="width:68px; height:68px; border-radius:50%; background:rgba(212,38,56,0.18); border:2px solid var(--accent-light); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; font-size:28px; color:var(--accent-light);">
            <i class="fas fa-ban"></i>
          </div>
          <div style="font-family:var(--font-tech); font-size:18px; font-weight:900; color:#fff; letter-spacing:1.5px; margin-bottom:8px;">
            ДОСТУП ЗАБЛОКИРОВАН
          </div>
          <div style="font-size:12px; color:var(--silver-muted); line-height:1.5; margin-bottom:16px;">
            Система безопасности <b style="color:#fff;">CYBER 6 SHIELD</b> ограничила доступ вашего устройства к функциям портала.
          </div>
          <div style="background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; text-align:left; font-size:11px; color:var(--silver);">
            <div style="margin-bottom:4px;">🚫 <b>Причина:</b> <span style="color:var(--accent-light);">${escapeHTML(clientSecurityMeta.banReason)}</span></div>
            <div style="margin-bottom:4px;">🆔 <b>Device ID:</b> <code>${escapeHTML(myDev)}</code></div>
            <div>🌐 <b>IP-адрес:</b> <code>${escapeHTML(myIp)}</code></div>
          </div>
        </div>
      `;
      overlay.classList.add('active');
    }
    return true;
  } else {
    clientSecurityMeta.isBanned = false;
    if (overlay) overlay.classList.remove('active');
    return false;
  }
}

onSnapshot(doc(db, DB_COLLECTION, "security_logs"), (snap) => {
  if (snap.exists()) {
    globalBannedList = snap.data().banned || [];
  } else {
    globalBannedList = [];
  }
  checkIfCurrentUserBanned();
});

async function logSecurityEvent(actionName, actorName, detailsText, isAlert = false) {
  await resolveClientIp();
  try {
    const ref = doc(db, DB_COLLECTION, "security_logs");
    const snap = await getDoc(ref);
    let logs = (snap.exists() && snap.data().logs) ? snap.data().logs : [];
    const banned = (snap.exists() && snap.data().banned) ? snap.data().banned : [];

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      action: actionName,
      actor: actorName,
      details: detailsText,
      ip: clientSecurityMeta.ip,
      deviceId: clientSecurityMeta.deviceId,
      deviceInfo: clientSecurityMeta.deviceInfo,
      isAlert: Boolean(isAlert)
    };

    logs.push(newEntry);
    if (logs.length > 80) logs = logs.slice(-80);

    await setDoc(ref, { logs, banned }, { merge: true });
  } catch (e) {
    console.warn("Security log error:", e);
  }
}

onSnapshot(doc(db, DB_COLLECTION, "bot_config"), (snap) => {
  if (snap.exists() && snap.data().encToken) {
    TG_CONFIG.token = decodeBotToken(snap.data().encToken);
  }
});

let allHistoryData = [];
let currentHistoryFilter = 'all';
let allScheduleData = [];
let currentScheduleFilter = 'all';
let mainRosterData = [];
let reserveRosterData = [];
let pantheonMeta = { boosts: {}, bonusPts: {} }; // Данные активности и бустов Пантеона в Firebase

let activeRosterTab = 'main';
let activePlayerIdx = 0;

// 3. АНТИСПАМ И УТИЛИТЫ
const BLACKLIST = [
  "дай", "gold", "голд", "голды", "дайте", "промо", "промокод",
  "скин", "нож", "аркана", "маты", "хуй", "пизд", "ебал", "бля",
  "чмо", "лох", "даун", "сука", "урод", "мамк", "мать", "админ дай", "бесплатно"
];

function containsSpam(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BLACKLIST.some(word => lower.includes(word));
}

function findMatchedSpamWord(text) {
  if (!text) return "";
  const lower = text.toLowerCase();
  return BLACKLIST.find(word => lower.includes(word)) || "спам";
}

function checkCooldown(key, timeInMinutes) {
  const lastTime = localStorage.getItem(key);
  if (!lastTime) return true;
  const diff = Date.now() - parseInt(lastTime, 10);
  return (diff / 60000) >= timeInMinutes;
}

function setCooldown(key) {
  localStorage.setItem(key, Date.now());
}

const escapeHTML = (str) => {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
};

function formatPlayerNickHTML(rawNick, isOurTeam = false) {
  if (!rawNick) return "Player";
  const clean = String(rawNick).trim();
  const tagMatch = clean.match(/^(\[[^\]]+\])\s*(.*)$/);
  if (tagMatch) {
    const tag = tagMatch[1];
    const rest = tagMatch[2] || "";
    const isC6E = /c6e|с6е/i.test(tag);
    return `<span class="${isC6E ? 'tag-c6e' : 'tag-clan'}">${escapeHTML(tag)}</span><span>${escapeHTML(rest)}</span>`;
  }
  if (isOurTeam) {
    return `<span class="tag-c6e">[C6E]</span><span>${escapeHTML(clean)}</span>`;
  }
  return `<span>${escapeHTML(clean)}</span>`;
}

// =========================================================================
// ЯДРО СИНХРОНИЗАЦИИ K/D + ИННОВАЦИОННЫЙ РЕЙТИНГ «ПАНТЕОН [C6E]» (PTS)
// =========================================================================

function normalizeNickKey(nick) {
  if (!nick) return "";
  return String(nick)
    .replace(/^\[?[cс]6[eе]\]?\s*\|?\s*/i, '')
    .replace(/^\[[^\]]+\]\s*/, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function isMatchWithinDays(dateStr, days = 7) {
  if (!dateStr) return true;
  const parts = String(dateStr).split('.');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    if (!isNaN(d.getTime())) {
      const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= days && diffDays >= -1;
    }
  }
  return true;
}

function computePlayerLiveAnalytics(playerObj) {
  const baseKd = parseFloat(playerObj.stats && playerObj.stats.kd ? String(playerObj.stats.kd).replace(',', '.') : '1.00') || 1.00;
  const pKey = normalizeNickKey(playerObj.nick);

  let totalKills = 0, totalAssists = 0, totalDeaths = 0, totalScore = 0;
  let matchesPlayed = 0, matchesWon = 0, mvpCount = 0;
  let weekKills = 0, weekAssists = 0, weekDeaths = 0, weekMatches = 0;
  const matchLogs = [];

  allHistoryData.forEach(m => {
    const ourScore = parseInt(m.our, 10) || 0;
    const theirScore = parseInt(m.their, 10) || 0;
    const isWin = ourScore > theirScore;
    const inWeek = isMatchWithinDays(m.date, 7);

    if (m.mvp && normalizeNickKey(m.mvp.split('(')[0]) === pKey) {
      mvpCount++;
    }

    const pList = m.players || [];
    const found = pList.find(mp => {
      const mKey = normalizeNickKey(mp.nick);
      return mKey && pKey && (mKey === pKey || mKey.includes(pKey) || pKey.includes(mKey));
    });

    if (found) {
      const k = parseInt(found.kills, 10) || 0;
      const a = parseInt(found.assists, 10) || 0;
      const d = parseInt(found.deaths, 10) || 0;
      const sc = parseInt(found.score, 10) || (k * 2 + a);
      const matchKd = d > 0 ? (k / d) : k;

      totalKills += k;
      totalAssists += a;
      totalDeaths += d;
      totalScore += sc;
      matchesPlayed++;
      if (isWin) matchesWon++;

      if (inWeek) {
        weekKills += k;
        weekAssists += a;
        weekDeaths += d;
        weekMatches++;
      }

      matchLogs.push({
        matchId: m.id,
        date: m.date || 'Матч',
        enemy: m.enemy || 'Соперник',
        map: m.map || 'Dune',
        scoreStr: `${ourScore}:${theirScore}`,
        isWin,
        kills: k,
        assists: a,
        deaths: d,
        kd: matchKd.toFixed(2),
        kdNum: matchKd
      });
    }
  });

  let liveKd = baseKd;
  let delta = 0;
  let pureMatchKd = baseKd;

  if (matchesPlayed > 0) {
    pureMatchKd = totalDeaths > 0 ? (totalKills / totalDeaths) : totalKills;
    const baseWeightDeaths = 25;
    const baseWeightKills = baseKd * baseWeightDeaths;
    liveKd = (baseWeightKills + totalKills) / (baseWeightDeaths + totalDeaths);
    delta = liveKd - baseKd;
  }

  const weekKd = weekMatches > 0 ? (weekDeaths > 0 ? (weekKills / weekDeaths) : weekKills) : liveKd;
  const weekDelta = weekMatches > 0 ? (weekKd - baseKd) : delta;

  let formLabel = '⚡ В НОРМЕ';
  let formClass = 'form-stable';
  if (delta >= 0.03 || (matchesPlayed > 0 && pureMatchKd >= 1.25)) {
    formLabel = '🔥 В ОГНЕ';
    formClass = 'form-fire';
  } else if (delta <= -0.04 || (matchesPlayed > 0 && pureMatchKd < 0.90)) {
    formLabel = '❄️ СПАД';
    formClass = 'form-cold';
  }

  // ФОРМУЛА ОЧКОВ ПАНТЕОНА (PTS = Скилл K/D + Прогресс K/D + Боевая активность в Табе + Активность на сайте)
  const fanBoosts = (pantheonMeta.boosts && pantheonMeta.boosts[pKey]) ? parseInt(pantheonMeta.boosts[pKey], 10) : 0;
  const founderBonus = (pantheonMeta.bonusPts && pantheonMeta.bonusPts[pKey]) ? parseInt(pantheonMeta.bonusPts[pKey], 10) : 0;

  const kdPts = Math.round(liveKd * 450); // Базовый вес скилла K/D
  const growthPts = Math.round(delta * 1200); // Огромный бонус за рост K/D за неделю!
  const matchActivityPts = (matchesPlayed * 85) + (matchesWon * 95) + (mvpCount * 160) + (totalKills * 3); // Активность в матчах
  const siteActivityPts = (fanBoosts * 25) + founderBonus; // Активность на сайте (бусты + бонус Основателя)

  const totalPantheonPts = Math.max(100, kdPts + growthPts + matchActivityPts + siteActivityPts);

  return {
    nick: playerObj.nick,
    pKey,
    role: playerObj.role || 'Player',
    img: playerObj.img || 'logo.png',
    baseKd: baseKd.toFixed(2),
    liveKd: liveKd.toFixed(2),
    pureMatchKd: pureMatchKd.toFixed(2),
    delta: delta,
    deltaFormatted: (delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)),
    matchesPlayed,
    matchesWon,
    winRate: matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0,
    totalKills,
    totalAssists,
    totalDeaths,
    totalScore,
    mvpCount,
    weekMatches,
    weekKills,
    weekAssists,
    weekDeaths,
    weekKd: weekKd.toFixed(2),
    weekDelta: weekDelta,
    weekDeltaFormatted: (weekDelta >= 0 ? `+${weekDelta.toFixed(2)}` : weekDelta.toFixed(2)),
    formLabel,
    formClass,
    recentMatches: matchLogs.slice(-5),
    // Показатели для ПАНТЕОНА
    fanBoosts,
    founderBonus,
    kdPts,
    growthPts,
    matchActivityPts,
    siteActivityPts,
    totalPantheonPts
  };
}

// Подписка на данные Пантеона (бусты активности на сайте и бонусы Основателя)
onSnapshot(doc(db, DB_COLLECTION, "pantheon"), (snap) => {
  if (snap.exists()) {
    pantheonMeta = {
      boosts: snap.data().boosts || {},
      bonusPts: snap.data().bonusPts || {}
    };
  } else {
    pantheonMeta = { boosts: {}, bonusPts: {} };
  }
  renderPantheonSection();
});

// Функция «🔥 БУСТ БОЙЦА (+25 PTS)» на сайте (раз в 12 часов с одного устройства)
window.boostPantheonPlayer = async (nick) => {
  if (checkIfCurrentUserBanned()) return;
  const pKey = normalizeNickKey(nick);
  if (!pKey) return;

  const cooldownKey = `c6e_boost_${pKey}`;
  if (!checkCooldown(cooldownKey, 360)) {
    return window.showNotify("Вы уже заряжали этого бойца сегодня! Следующий буст через 6 часов.", "error");
  }

  try {
    const ref = doc(db, DB_COLLECTION, "pantheon");
    const snap = await getDoc(ref);
    let boosts = (snap.exists() && snap.data().boosts) ? { ...snap.data().boosts } : {};
    boosts[pKey] = (parseInt(boosts[pKey], 10) || 0) + 1;

    await setDoc(ref, { boosts }, { merge: true });
    setCooldown(cooldownKey);
    window.showNotify(`🔥 Вы дали +25 PTS активности бойцу ${nick} в гонке за Голду!`, "success");
  } catch (e) {
    window.showNotify("Ошибка начисления буста", "error");
  }
};

// Таймер до конца недели (Воскресенье 23:59:59 МСК) для выдачи 500 / 250 / 150 Голды
function getWeeklyResetCountdownText() {
  const now = new Date();
  const day = now.getDay(); // 0 = Воскресенье
  const daysUntilSunday = day === 0 ? 0 : (7 - day);
  const endOfSunday = new Date(now);
  endOfSunday.setDate(now.getDate() + daysUntilSunday);
  endOfSunday.setHours(23, 59, 59, 999);

  const diff = Math.max(0, endOfSunday.getTime() - now.getTime());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${d}д : ${h}ч : ${m}м`;
}

// Рендер инновационного раздела «ПАНТЕОН [C6E]»
function renderPantheonSection() {
  const root = document.getElementById('pantheon-root');
  if (!root) return;

  const allPlayers = [...mainRosterData, ...reserveRosterData];
  if (allPlayers.length === 0) {
    root.innerHTML = `
      <div class="pantheon-hero">
        <div class="pantheon-badge-top"><i class="fas fa-crown"></i> C6E WEEKLY GOLD RACE</div>
        <h2 class="pantheon-title">ПАНТЕОН <span>[C6E]</span></h2>
        <p style="font-size:12px; color:var(--silver-muted);">Бойцы состава скоро вступят в еженедельную гонку за 900 Голды от Основателя!</p>
      </div>
    `;
    return;
  }

  const ranked = allPlayers.map(p => computePlayerLiveAnalytics(p));
  ranked.sort((a, b) => b.totalPantheonPts - a.totalPantheonPts);

  const maxPts = ranked[0] ? ranked[0].totalPantheonPts : 1000;
  const top3 = ranked.slice(0, 3);
  const chasers = ranked.slice(3);

  const prizes = [
    { rank: 1, gold: '500 GOLD', medal: '🥇 1 МЕСТО', cls: 'rank-1', color: '#ffb300' },
    { rank: 2, gold: '250 GOLD', medal: '🥈 2 МЕСТО', cls: 'rank-2', color: '#e4e4e2' },
    { rank: 3, gold: '150 GOLD', medal: '🥉 3 МЕСТО', cls: 'rank-3', color: '#cd7f32' }
  ];

  const podiumHtml = top3.map((st, idx) => {
    const pr = prizes[idx];
    const safeNick = escapeHTML(st.nick).replace(/'/g, "\\'");
    const pct = Math.min(100, Math.round((st.totalPantheonPts / Math.max(1, maxPts)) * 100));
    const gapToFirst = idx === 0 ? '👑 ЛИДЕР ГОНКИ ЗА 500 GOLD' : `До 1 места: ${maxPts - st.totalPantheonPts} PTS`;

    return `
      <div class="podium-card ${pr.cls}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-family:var(--font-tech); font-size:10px; font-weight:900; color:${pr.color}; background:rgba(255,255,255,0.06); padding:4px 9px; border-radius:6px; border:1px solid ${pr.color};">
              ${pr.medal}
            </span>
            <span style="font-family:var(--font-tech); font-size:11px; font-weight:900; color:#000; background:${pr.color}; padding:4px 10px; border-radius:6px;">
              🎁 ${pr.gold}
            </span>
          </div>

          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="${escapeHTML(st.img)}" onerror="this.src='logo.png'" style="width:62px; height:62px; border-radius:14px; object-fit:cover; border:2px solid ${pr.color};">
            <div style="min-width:0; flex:1;">
              <div style="font-family:var(--font-tech); font-size:16px; font-weight:900; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${formatPlayerNickHTML(st.nick, true)}
              </div>
              <div style="font-size:10px; color:var(--silver-muted); margin-top:2px;">${escapeHTML(st.role)} • <span class="${st.formClass}" style="padding:1px 5px; border-radius:4px; font-size:8px;">${st.formLabel}</span></div>
              <div style="font-family:var(--font-tech); font-size:18px; font-weight:900; color:${pr.color}; margin-top:4px;">
                ${st.totalPantheonPts} <span style="font-size:10px; color:var(--silver);">PTS</span>
              </div>
            </div>
          </div>

          <div class="pts-bar-bg">
            <div class="pts-bar-fill" style="width:${pct}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--silver-muted); margin-bottom:10px;">
            <span>${gapToFirst}</span>
            <span>LIVE K/D: <b style="color:#fff;">${st.liveKd}</b> (${st.deltaFormatted})</span>
          </div>

          <!-- Прозрачная расшифровка инновационного индекса PTS -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:5px; background:rgba(0,0,0,0.45); padding:8px 6px; border-radius:8px; text-align:center; margin-bottom:12px; border:1px solid rgba(255,255,255,0.05);">
            <div>
              <div style="font-family:var(--font-tech); font-size:11px; font-weight:800; color:#fff;">${st.kdPts + st.growthPts}</div>
              <div style="font-size:7px; color:var(--silver-muted); text-transform:uppercase;">СКИЛЛ & РОСТ K/D</div>
            </div>
            <div style="border-left:1px solid rgba(255,255,255,0.06); border-right:1px solid rgba(255,255,255,0.06);">
              <div style="font-family:var(--font-tech); font-size:11px; font-weight:800; color:var(--success);">+${st.matchActivityPts}</div>
              <div style="font-size:7px; color:var(--silver-muted); text-transform:uppercase;">ИГРЫ В ТАБЕ (${st.matchesPlayed})</div>
            </div>
            <div>
              <div style="font-family:var(--font-tech); font-size:11px; font-weight:800; color:#ffb300;">+${st.siteActivityPts}</div>
              <div style="font-size:7px; color:var(--silver-muted); text-transform:uppercase;">АКТИВ САЙТА (🔥${st.fanBoosts})</div>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:6px;">
          <button type="button" class="boost-btn" onclick="window.boostPantheonPlayer('${safeNick}')">
            <i class="fas fa-fire"></i> БУСТ БОЙЦА (+25 PTS)
          </button>
          <button type="button" class="chip-btn" style="padding:9px 12px;" onclick="window.openPlayerDossier('${safeNick}')" title="Открыть досье">
            📊
          </button>
        </div>
      </div>
    `;
  }).join('');

  const chasersHtml = chasers.length > 0 ? `
    <div class="so2-team-panel" style="margin-top:8px;">
      <div class="so2-team-header c6e-head">
        <span>⚔️ ПРЕТЕНДЕНТЫ В ГОНКЕ ЗА ПРИЗОВУЮ ТРОЙКУ ПАНТЕОНА</span>
        <span>ДО ТОП-3</span>
      </div>
      <div class="so2-table-wrap">
        <table class="so2-table">
          <thead>
            <tr>
              <th>Место</th>
              <th class="col-name">Боец [C6E]</th>
              <th>LIVE K/D (Сдвиг)</th>
              <th>Матчей</th>
              <th>Актив (🔥)</th>
              <th>Очки PTS</th>
              <th>Поддержать</th>
            </tr>
          </thead>
          <tbody>
            ${chasers.map((st, i) => {
              const rankNum = i + 4;
              const safeNick = escapeHTML(st.nick).replace(/'/g, "\\'");
              const thirdPts = top3[2] ? top3[2].totalPantheonPts : st.totalPantheonPts;
              const diffToPrize = Math.max(0, thirdPts - st.totalPantheonPts + 1);
              return `
                <tr>
                  <td style="font-family:var(--font-tech); font-weight:800; color:var(--silver-muted);">#${rankNum}</td>
                  <td class="col-name">${formatPlayerNickHTML(st.nick, true)}</td>
                  <td>
                    <b style="color:#fff; font-family:var(--font-tech);">${st.liveKd}</b>
                    <span class="kd-delta ${st.delta > 0.004 ? 'delta-up' : (st.delta < -0.004 ? 'delta-down' : 'delta-neutral')}">${st.deltaFormatted}</span>
                  </td>
                  <td>${st.matchesPlayed}</td>
                  <td style="color:#ffb300; font-weight:700;">🔥 ${st.fanBoosts}</td>
                  <td>
                    <b style="font-family:var(--font-tech); color:#fff;">${st.totalPantheonPts} PTS</b>
                    <div style="font-size:8px; color:var(--silver-muted);">до 150 Gold: -${diffToPrize} PTS</div>
                  </td>
                  <td>
                    <button type="button" class="chip-btn" style="border-color:#ffb300; color:#ffb300;" onclick="window.boostPantheonPlayer('${safeNick}')">
                      🔥 +25 PTS
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';

  root.innerHTML = `
    <div class="pantheon-hero">
      <div class="pantheon-badge-top">
        <i class="fas fa-crown"></i> ЕЖЕНЕДЕЛЬНАЯ ПРЕМИЯ ОТ ОСНОВАТЕЛЯ KAS • ВЫПЛАТА КАЖДОЕ ВОСКРЕСЕНЬЕ
      </div>
      <h2 class="pantheon-title">ПАНТЕОН <span>[C6E]</span></h2>
      <p style="font-size:11px; color:var(--silver); max-width:640px; margin:0 auto; line-height:1.5;">
        Инновационный живой рейтинг бойцов организации <b>CYBER 6 ESPORTS</b>. Очки <b>PTS</b> начисляются автоматически за <b>рост K/D в Табах</b>, сыгранные матчи, титулы <b>MVP</b> и <b>активность на сайте</b>!
      </p>

      <div class="pantheon-prize-strip">
        <div class="prize-tier-box gold">
          <div style="font-size:16px; margin-bottom:2px;">🥇</div>
          <div class="prize-gold-amount" style="color:#ffb300;">500 GOLD</div>
          <div class="prize-gold-lbl">1 МЕСТО НЕДЕЛИ</div>
        </div>
        <div class="prize-tier-box silver">
          <div style="font-size:16px; margin-bottom:2px;">🥈</div>
          <div class="prize-gold-amount" style="color:#e4e4e2;">250 GOLD</div>
          <div class="prize-gold-lbl">2 МЕСТО НЕДЕЛИ</div>
        </div>
        <div class="prize-tier-box bronze">
          <div style="font-size:16px; margin-bottom:2px;">🥉</div>
          <div class="prize-gold-amount" style="color:#ffb070;">150 GOLD</div>
          <div class="prize-gold-lbl">3 МЕСТО НЕДЕЛИ</div>
        </div>
      </div>

      <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.12); padding:6px 14px; border-radius:20px; font-family:var(--font-tech); font-size:10px; color:var(--silver);">
        <i class="far fa-clock" style="color:#ffb300;"></i> ДО РАЗДАЧИ ГОЛДЫ ОСТАЛОСЬ: <b style="color:#ffb300;">${getWeeklyResetCountdownText()}</b>
      </div>
    </div>

    <div class="podium-grid">
      ${podiumHtml}
    </div>

    ${chasersHtml}
  `;
}

window.showNotify = (text, type) => {
  const container = document.getElementById('notify-container');
  if (!container) return;
  const notif = document.createElement('div');
  notif.className = 'hud-toast active';
  notif.style.borderLeftColor = type === 'error' ? 'var(--accent-light)' : 'var(--success)';
  notif.innerHTML = `
    <i class="${type === 'error' ? 'fas fa-exclamation-triangle text-accent' : 'fas fa-check-circle'}" style="color:${type === 'error' ? 'var(--accent-light)' : 'var(--success)'}"></i>
    <span>${text}</span>
  `;
  container.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(120%)';
    setTimeout(() => notif.remove(), 500);
  }, 3000);
};

async function sendToBot(chatId, message) {
  if (!TG_CONFIG.token) {
    const snap = await getDoc(doc(db, DB_COLLECTION, "bot_config"));
    if (snap.exists() && snap.data().encToken) {
      TG_CONFIG.token = decodeBotToken(snap.data().encToken);
    }
  }
  if (!TG_CONFIG.token) return;

  const response = await fetch(`https://api.telegram.org/bot${TG_CONFIG.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });
  const res = await response.json();
  if (!res.ok) throw new Error(res.description);
}

function checkUpdateBadge(key, latestId, btnId) {
  const lastSeen = parseInt(localStorage.getItem('last_seen_' + key) || '0', 10);
  const btn = document.getElementById(btnId);
  if (btn) {
    if (latestId > lastSeen) btn.classList.add('has-update');
    else btn.classList.remove('has-update');
  }
}

// =========================================================================
// 4. ВИТРИНА СОСТАВА НА 1 ЭКРАН (СВАЙП-КАРУСЕЛЬ + БЫСТРЫЙ ВЫБОР ИГРОКА)
// =========================================================================

window.switchRosterTab = (tabMode) => {
  activeRosterTab = tabMode;
  activePlayerIdx = 0;
  renderAllRosters();
};

window.jumpToPlayerSlide = (idx) => {
  activePlayerIdx = idx;
  const track = document.getElementById('c6e-roster-track');
  const cards = track ? track.querySelectorAll('.pro-player-card') : [];
  if (cards[idx]) {
    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  document.querySelectorAll('.player-chip').forEach((ch, i) => {
    ch.classList.toggle('active', i === idx);
  });
  const counterEl = document.getElementById('roster-slide-counter');
  if (counterEl && cards.length > 0) {
    counterEl.innerText = `БОЕЦ ${idx + 1} ИЗ ${cards.length}`;
  }
};

window.stepPlayerSlide = (dir) => {
  const currentList = activeRosterTab === 'reserve' ? reserveRosterData : mainRosterData;
  if (!currentList.length) return;
  let nextIdx = activePlayerIdx + dir;
  if (nextIdx < 0) nextIdx = currentList.length - 1;
  if (nextIdx >= currentList.length) nextIdx = 0;
  window.jumpToPlayerSlide(nextIdx);
};

function renderAllRosters() {
  const teamSection = document.getElementById('team');
  if (!teamSection) return;

  const currentList = activeRosterTab === 'reserve' ? reserveRosterData : mainRosterData;

  let mainContentHtml = '';

  if (!currentList || currentList.length === 0) {
    mainContentHtml = `
      <div class="card text-center" style="padding: 35px 20px; color: var(--silver-muted); font-family: var(--font-tech);">
        В ЭТОМ СОСТАВЕ ПОКА НЕТ ИГРОКОВ
      </div>
    `;
  } else if (activeRosterTab === 'table') {
    const allCombined = [...mainRosterData, ...reserveRosterData];
    mainContentHtml = `
      <div class="so2-team-panel">
        <div class="so2-team-header c6e-head">
          <span>ВСЕ БОЙЦЫ ОРГАНИЗАЦИИ [C6E] НА ОДНОМ ЭКРАНЕ</span>
          <span>${allCombined.length} ИГР.</span>
        </div>
        <div class="so2-table-wrap">
          <table class="so2-table">
            <thead>
              <tr>
                <th class="col-name">Боец [C6E]</th>
                <th>Роль</th>
                <th>LIVE K/D</th>
                <th>Сдвиг</th>
                <th>PTS Пантеона</th>
                <th>Досье</th>
              </tr>
            </thead>
            <tbody>
              ${allCombined.map(p => {
                const st = computePlayerLiveAnalytics(p);
                const safeNick = escapeHTML(p.nick).replace(/'/g, "\\'");
                return `
                  <tr>
                    <td class="col-name">${formatPlayerNickHTML(p.nick, true)}</td>
                    <td style="font-size:10px; color:var(--silver-muted);">${escapeHTML(p.role)}</td>
                    <td style="font-family:var(--font-tech); font-weight:800; color:#fff;">${st.liveKd}</td>
                    <td><span class="kd-delta ${st.delta > 0.004 ? 'delta-up' : (st.delta < -0.004 ? 'delta-down' : 'delta-neutral')}">${st.deltaFormatted}</span></td>
                    <td style="color:#ffb300; font-family:var(--font-tech); font-weight:800;">${st.totalPantheonPts} PTS</td>
                    <td><button class="chip-btn" onclick="window.openPlayerDossier('${safeNick}')">📊</button></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    const selectorChipsHtml = currentList.map((p, idx) => {
      const st = computePlayerLiveAnalytics(p);
      const shortNick = p.nick.replace(/^\[?[cс]6[eе]\]?\s*\|?\s*/i, '');
      return `
        <div class="player-chip ${idx === activePlayerIdx ? 'active' : ''}" onclick="window.jumpToPlayerSlide(${idx})">
          <img src="${escapeHTML(p.img || 'logo.png')}" onerror="this.src='logo.png'">
          <span class="player-chip-nick">${escapeHTML(shortNick)}</span>
          <span class="player-chip-kd">${st.liveKd}</span>
        </div>
      `;
    }).join('');

    const cardsHtml = currentList.map((p) => {
      const st = computePlayerLiveAnalytics(p);
      const rank = (p.stats && p.stats.rank) ? p.stats.rank : 'The Legend';

      let deltaBadge = `<span class="kd-delta delta-neutral">БАЗА</span>`;
      if (st.matchesPlayed > 0) {
        if (st.delta > 0.004) deltaBadge = `<span class="kd-delta delta-up">▲ ${st.deltaFormatted}</span>`;
        else if (st.delta < -0.004) deltaBadge = `<span class="kd-delta delta-down">▼ ${st.deltaFormatted}</span>`;
        else deltaBadge = `<span class="kd-delta delta-neutral">= 0.00</span>`;
      }

      const recentHtml = st.recentMatches.length > 0
        ? st.recentMatches.map(rm => `<span class="recent-pill ${ parseFloat(rm.kd) >= 1.0 ? 'good' : 'bad' }">${rm.kd}</span>`).join('')
        : `<span style="font-size:9px; color:#666;">Ожидание игр в Табе</span>`;

      const safeNickArg = escapeHTML(p.nick).replace(/'/g, "\\'");

      return `
        <div class="pro-player-card">
          <div class="pro-card-top">
            <img src="${escapeHTML(p.img || 'logo.png')}" class="pro-card-avatar" onerror="this.src='logo.png'">
            <div class="pro-card-shade"></div>

            <div class="pro-badges-row">
              <span class="pro-role-badge">${escapeHTML(p.role || 'PLAYER')}</span>
              <span class="pro-form-badge ${st.formClass}">${st.formLabel}</span>
            </div>

            <div class="pro-identity">
              <h3 class="pro-nick">
                ${formatPlayerNickHTML(p.nick, true)}
                <span style="font-size:9px; background:rgba(255,179,0,0.2); border:1px solid #ffb300; color:#ffb300; padding:2px 6px; border-radius:4px;">👑 ${st.totalPantheonPts} PTS</span>
              </h3>
              <div class="pro-quote">"${escapeHTML(p.quote || 'Cyber 6 Esports')}"</div>
            </div>
          </div>

          <div class="pro-card-body">
            <div class="pro-metrics-grid">
              <div class="pro-metric-box" style="border-right:1px solid rgba(255,255,255,0.06);">
                <div class="pro-metric-val">
                  <span style="color:${parseFloat(st.liveKd) >= 1.0 ? 'var(--success)' : 'var(--accent-light)'};">${st.liveKd}</span>
                  ${deltaBadge}
                </div>
                <div class="pro-metric-lbl">LIVE K/D (ТАБ)</div>
              </div>

              <div class="pro-metric-box" style="border-right:1px solid rgba(255,255,255,0.06);">
                <div class="pro-metric-val">${st.totalKills} <span style="font-size:10px; color:var(--silver-muted);">/ ${st.totalDeaths}</span></div>
                <div class="pro-metric-lbl">УБИЙСТВА / СМЕРТИ</div>
              </div>

              <div class="pro-metric-box">
                <div class="pro-metric-val" style="font-size:12px; color:var(--silver);">${escapeHTML(rank)}</div>
                <div class="pro-metric-lbl">РАНГ (${st.matchesPlayed} ИГР)</div>
              </div>
            </div>

            <div class="pro-recent-strip">
              <span style="color:var(--silver-muted); font-weight:700; font-size:9px;">ПОСЛЕДНИЕ МАТЧИ:</span>
              <div class="recent-dots">${recentHtml}</div>
            </div>

            <div class="pro-specs-compact">
              <div>
                <div class="spec-mini-lbl">ДЕВАЙС</div>
                <div class="spec-mini-val">${escapeHTML(p.device || 'Mobile')}</div>
              </div>
              <div style="border-left:1px solid rgba(255,255,255,0.06); border-right:1px solid rgba(255,255,255,0.06);">
                <div class="spec-mini-lbl">СЕНСА</div>
                <div class="spec-mini-val">${escapeHTML(p.settings || 'Default')}</div>
              </div>
              <div>
                <div class="spec-mini-lbl">ОРУЖИЕ</div>
                <div class="spec-mini-val" style="color:var(--accent-light);">${escapeHTML(p.weapon || 'AKR / AWM')}</div>
              </div>
            </div>

            <div style="display:flex; gap:6px;">
              <button type="button" class="btn-glitch" style="padding:10px; font-size:10px; flex:1;" onclick="window.openPlayerDossier('${safeNickArg}')">
                <i class="fas fa-chart-bar" style="margin-right:6px;"></i> ДОСЬЕ И ПРОГРЕСС
              </button>
              <button type="button" class="boost-btn" style="width:auto; padding:10px 12px;" onclick="window.boostPantheonPlayer('${safeNickArg}')" title="Поддержать бойца в Пантеоне (+25 PTS)">
                🔥 +25 PTS
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    mainContentHtml = `
      <div class="player-selector-bar">${selectorChipsHtml}</div>
      <div class="roster-carousel-wrap">
        <div class="roster-swipe-track" id="c6e-roster-track">${cardsHtml}</div>
        <div class="carousel-nav-bar">
          <button type="button" class="carousel-arrow-btn" onclick="window.stepPlayerSlide(-1)"><i class="fas fa-chevron-left"></i></button>
          <span id="roster-slide-counter" style="font-family:var(--font-tech); font-size:10px; color:var(--silver-muted); letter-spacing:1px;">
            СВАЙПАЙ ВЛЕВО / ВПРАВО (${activePlayerIdx + 1} ИЗ ${currentList.length})
          </span>
          <button type="button" class="carousel-arrow-btn" onclick="window.stepPlayerSlide(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    `;
  }

  teamSection.innerHTML = `
    <div class="roster-hub-controls">
      <div class="squad-tabs">
        <button type="button" class="squad-tab-btn ${activeRosterTab === 'main' ? 'active' : ''}" onclick="window.switchRosterTab('main')">
          <i class="fas fa-crosshairs"></i> ОСНОВА (${mainRosterData.length})
        </button>
        <button type="button" class="squad-tab-btn ${activeRosterTab === 'reserve' ? 'active' : ''}" onclick="window.switchRosterTab('reserve')">
          <i class="fas fa-shield-alt"></i> РЕЗЕРВ (${reserveRosterData.length})
        </button>
        <button type="button" class="squad-tab-btn ${activeRosterTab === 'table' ? 'active' : ''}" onclick="window.switchRosterTab('table')">
          <i class="fas fa-list"></i> СПИСКОМ
        </button>
      </div>
      <button type="button" class="report-mini-btn" style="border-color:#ffb300; color:#ffb300;" onclick="selectTab('pantheon', document.getElementById('btn-pantheon'))">
        <i class="fas fa-crown"></i> ПАНТЕОН (900G)
      </button>
    </div>

    ${mainContentHtml}
  `;

  const track = document.getElementById('c6e-roster-track');
  if (track) {
    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      if (idx !== activePlayerIdx && idx >= 0 && idx < currentList.length) {
        activePlayerIdx = idx;
        document.querySelectorAll('.player-chip').forEach((ch, i) => ch.classList.toggle('active', i === idx));
        const counterEl = document.getElementById('roster-slide-counter');
        if (counterEl) counterEl.innerText = `СВАЙПАЙ ВЛЕВО / ВПРАВО (${idx + 1} ИЗ ${currentList.length})`;
      }
    }, { passive: true });
  }
}

window.openPlayerDossier = (nick) => {
  const allPlayers = [...mainRosterData, ...reserveRosterData];
  const p = allPlayers.find(item => item.nick === nick) || allPlayers[0];
  if (!p) return;

  const st = computePlayerLiveAnalytics(p);
  const content = document.getElementById('c6e-analytics-content');

  const logsHtml = st.recentMatches.length === 0
    ? `<div style="text-align:center; padding:18px; color:#666; font-size:12px;">Игрок пока не занесен ни в один послематчевый Таб. Добавьте матч с участием <b>${escapeHTML(p.nick)}</b> в админке!</div>`
    : `<table class="so2-table" style="margin-top:8px;">
        <thead>
          <tr>
            <th class="col-name">Матч / Карта</th>
            <th>Счет</th>
            <th>У</th>
            <th>П</th>
            <th>С</th>
            <th>K/D в матче</th>
          </tr>
        </thead>
        <tbody>
          ${st.recentMatches.slice().reverse().map(m => `
            <tr>
              <td class="col-name">VS ${escapeHTML(m.enemy)} <span style="color:var(--silver-muted); font-size:9px;">(${escapeHTML(m.map)})</span></td>
              <td style="color:${m.isWin ? 'var(--success)' : 'var(--accent-light)'}; font-family:var(--font-tech);">${m.scoreStr}</td>
              <td>${m.kills}</td>
              <td>${m.assists}</td>
              <td>${m.deaths}</td>
              <td style="font-family:var(--font-tech); font-weight:800; color:${m.kdNum >= st.baseKd ? 'var(--success)' : 'var(--accent-light)'};">
                ${m.kd} ${m.kdNum >= st.baseKd ? '▲' : '▼'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--glass-border); padding-bottom:12px; margin-bottom:16px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="${escapeHTML(p.img || 'logo.png')}" onerror="this.src='logo.png'" style="width:52px; height:52px; border-radius:10px; object-fit:cover; border:1px solid var(--accent-light);">
        <div>
          <div style="font-family:var(--font-tech); font-size:17px; font-weight:900; color:#fff;">${formatPlayerNickHTML(p.nick, true)}</div>
          <div style="font-size:10px; color:var(--silver-muted);">${escapeHTML(p.role || 'Боец')} • Базовый K/D: ${st.baseKd} • <b style="color:#ffb300;">${st.totalPantheonPts} PTS</b></div>
        </div>
      </div>
      <button class="btn-glitch" style="width:auto; padding:7px 14px; font-size:10px;" onclick="closeAnalyticsModal()">ЗАКРЫТЬ ✕</button>
    </div>

    <div class="so2-tab-grid" style="margin-top:0; margin-bottom:16px;">
      <div class="mvp-card" style="border-left:3px solid ${st.delta >= 0 ? 'var(--success)' : 'var(--accent-light)'};">
        <div>
          <div style="font-size:9px; color:var(--silver-muted); font-weight:700;">ТЕКУЩИЙ LIVE K/D (С УЧЕТОМ ТАБА)</div>
          <div style="font-family:var(--font-tech); font-size:20px; font-weight:900; color:#fff; margin-top:3px;">
            ${st.liveKd} <span class="kd-delta ${st.delta >= 0 ? 'delta-up' : 'delta-down'}">${st.delta >= 0 ? '▲' : '▼'} ${st.deltaFormatted}</span>
          </div>
        </div>
      </div>

      <div class="mvp-card" style="border-left:3px solid #ffb300;">
        <div>
          <div style="font-size:9px; color:var(--silver-muted); font-weight:700;">РЕЙТИНГ В ПАНТЕОНЕ (ГОНКА ЗА 900 GOLD)</div>
          <div style="font-family:var(--font-tech); font-size:15px; font-weight:800; color:#ffb300; margin-top:3px;">
            ${st.totalPantheonPts} PTS • Бустов на сайте: 🔥 ${st.fanBoosts}
          </div>
        </div>
      </div>
    </div>

    <div style="font-family:var(--font-tech); font-size:11px; color:var(--silver); margin-bottom:6px;">
      <i class="fas fa-history text-accent"></i> ИСТОРИЯ ВЫСТУПЛЕНИЙ БОЙЦА В ТАБЕ:
    </div>
    <div class="so2-table-wrap">${logsHtml}</div>
  `;

  document.getElementById('c6e-analytics-modal').classList.add('active');
};

window.openWeeklyTeamReport = () => {
  selectTab('pantheon', document.getElementById('btn-pantheon'));
};

onSnapshot(doc(db, DB_COLLECTION, "roster_main"), (s) => {
  mainRosterData = (s.exists() && s.data().list) ? s.data().list : [];
  renderAllRosters();
  renderPantheonSection();
});

onSnapshot(doc(db, DB_COLLECTION, "roster_reserve"), (s) => {
  reserveRosterData = (s.exists() && s.data().list) ? s.data().list : [];
  renderAllRosters();
  renderPantheonSection();
});

// =========================================================
// 5. НОВОСТИ, ТАЙМЕР, ПРАКИ И РАСПИСАНИЕ
// =========================================================

// ============================================================================
// АВТО-СИСТЕМА ОБНОВЛЕНИЙ САЙТА И УВЕДОМЛЕНИЙ ОТ РАЗРАБОТЧИКА KAS (@kas_0ff)
// ============================================================================
const DEFAULT_KAS_RELEASE = {
  id: 1763000450000,
  versionId: "c6e_release_v4_5_pantheon",
  versionLabel: "v4.5 // PANTHEON & LIVE TAB",
  date: "13.11.2026",
  tag: "ОБНОВЛЕНИЕ",
  author: "Kas (@kas_0ff)",
  title: "🚀 ГЛОБАЛЬНОЕ ОБНОВЛЕНИЕ САЙТА v4.5 ОТ KAS: «ПАНТЕОН» НА 900 ГОЛДЫ, БУСТЫ БОЙЦОВ И LIVE-ТАБ!",
  text: `
    <div style="margin:0 0 16px 0; border-radius:12px; overflow:hidden; border:1px solid rgba(255,179,0,0.45); background:linear-gradient(135deg, rgba(158,27,40,0.35) 0%, rgba(10,11,15,0.98) 60%, rgba(255,179,0,0.16) 100%); padding:18px; position:relative; box-shadow:0 12px 32px rgba(0,0,0,0.65);">
      <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
        <img src="logo.png" alt="C6E" onerror="this.style.display='none'" style="width:68px; height:68px; object-fit:contain; border-radius:14px; border:1px solid rgba(255,179,0,0.5); background:rgba(0,0,0,0.5); padding:6px;">
        <div style="flex:1; min-width:200px;">
          <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,179,0,0.15); border:1px solid #ffb300; color:#ffb300; font-family:'Orbitron',sans-serif; font-size:9px; font-weight:800; padding:3px 10px; border-radius:20px; letter-spacing:1px; margin-bottom:6px;">
            ⚡ OFFICIAL PORTAL UPDATE v4.5 • BY KAS
          </div>
          <div style="font-family:'Orbitron',sans-serif; font-size:16px; font-weight:900; color:#ffffff; letter-spacing:0.5px;">
            CYBER <span style="color:#d42638;">6</span> ESPORTS // <span style="color:#ffb300;">PANTHEON ERA</span>
          </div>
          <div style="font-size:11px; color:#aaa; margin-top:3px;">
            Разработчик и Основатель: <strong style="color:#fff;">Kas (Джораев Неджи)</strong> • <em>Официальный релиз для игроков и гостей портала</em>
          </div>
        </div>
      </div>
    </div>

    <p style="margin:0 0 12px 0; font-size:13.5px; color:#e4e4e2; line-height:1.7;">
      Салам всем бойцам нашего состава и гостям портала! На связи <strong>Kas</strong> — основатель и главный разработчик <strong>CYBER 6 ESPORTS <code>[C6E]</code></strong>. Сегодня на нашем официальном сайте вышло крупное обновление <code style="background:rgba(212,38,56,0.18); border:1px solid rgba(212,38,56,0.45); padding:2px 7px; border-radius:4px; color:#ff6b7a; font-family:'Orbitron',sans-serif; font-size:11px;">v4.5</code>, которое выводит соревновательную систему клана на совершенно новый уровень!
    </p>

    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:14px 16px; margin:14px 0;">
      <div style="font-family:'Orbitron',sans-serif; font-size:12px; font-weight:800; color:#ffb300; margin-bottom:10px; letter-spacing:1px;">
        👑 1. НОВЫЙ РАЗДЕЛ «ПАНТЕОН [C6E]» — ГОНКА ЗА 900 ГОЛДЫ КАЖДУЮ НЕДЕЛЮ
      </div>
      <p style="margin:0 0 8px 0; font-size:13px; color:#ccc; line-height:1.65;">
        На сайте открыт элитный зал славы и еженедельной гонки <strong>«ПАНТЕОН»</strong>! Каждое воскресенье в <code style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; color:#fff;">23:59 (МСК)</code> тройка лучших бойцов недели получает личный <em>Бонус от Основателя Kas</em>:
      </p>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;">
        <span style="background:rgba(255,179,0,0.16); border:1px solid #ffb300; color:#ffb300; font-family:'Orbitron',sans-serif; font-size:11px; font-weight:800; padding:5px 11px; border-radius:6px;">🥇 1 МЕСТО — 500 GOLD</span>
        <span style="background:rgba(228,228,226,0.12); border:1px solid #e4e4e2; color:#ffffff; font-family:'Orbitron',sans-serif; font-size:11px; font-weight:800; padding:5px 11px; border-radius:6px;">🥈 2 МЕСТО — 250 GOLD</span>
        <span style="background:rgba(205,127,50,0.16); border:1px solid #cd7f32; color:#ffb074; font-family:'Orbitron',sans-serif; font-size:11px; font-weight:800; padding:5px 11px; border-radius:6px;">🥉 3 МЕСТО — 150 GOLD</span>
      </div>
      <p style="margin:6px 0 0 0; font-size:12.5px; color:#bbb; line-height:1.6;">
        Рейтинг считается автоматически по умной формуле <code style="background:rgba(255,179,0,0.15); padding:2px 6px; border-radius:4px; color:#ffb300;">PTS</code>: учитывается твой <strong>LIVE K/D</strong>, <em>еженедельный прирост скилла (<code>Δ K/D</code>)</em>, сыгранные матчи и награды <code>MVP</code> в Табах, а также поддержка на сайте!
      </p>
    </div>

    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:14px 16px; margin:14px 0;">
      <div style="font-family:'Orbitron',sans-serif; font-size:12px; font-weight:800; color:#00e676; margin-bottom:8px; letter-spacing:1px;">
        🔥 2. КНОПКА «БУСТ БОЙЦА (+25 PTS)» И АКТИВНОСТЬ НА ПОРТАЛЕ
      </div>
      <p style="margin:0; font-size:13px; color:#ccc; line-height:1.65;">
        Теперь каждый игрок и болельщик клана может напрямую влиять на исход гонки за Голду! Заходи в раздел <strong>«Пантеон»</strong> или <strong>«Состав»</strong> и нажимай кнопку <code style="background:rgba(255,179,0,0.2); border:1px solid #ffb300; padding:2px 7px; border-radius:4px; color:#ffb300; font-weight:700;">🔥 БУСТ БОЙЦА (+25 PTS)</code> каждые <em>6 часов</em>, чтобы продвинуть своего фаворита на подиум.
      </p>
    </div>

    <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:14px 16px; margin:14px 0;">
      <div style="font-family:'Orbitron',sans-serif; font-size:12px; font-weight:800; color:#5294ff; margin-bottom:8px; letter-spacing:1px;">
        📊 3. ЖИВАЯ СТАТИСТИКА LIVE K/D, ДОСЬЕ ИГРОКОВ И ДВОЙНОЙ ТАБ 5v5
      </div>
      <p style="margin:0; font-size:13px; color:#ccc; line-height:1.65;">
        Карточки всех бойцов основы и резерва теперь работают в режиме <em>реального времени</em>: после каждого официального прака или турнира сайт сам пересчитывает <code>LIVE K/D</code>, динамику формы (<strong>🔥 В ОГНЕ</strong>) и винрейт. А в разделе <strong>«Матчи»</strong> доступен полный разворот <strong>Двойного Таба Standoff 2</strong> с точной статистикой <code>У / П / С / K/D / Счёт / Пинг</code> обоих составов и оригинальным скриншотом-пруфом.
      </p>
    </div>

    <blockquote style="margin:16px 0 8px 0; padding:14px 18px; border-left:4px solid #ffb300; background:rgba(255,179,0,0.07); color:#e4e4e2; font-style:italic; border-radius:0 10px 10px 0; line-height:1.65;">
      «Я разработал это обновление специально для того, чтобы каждый боец <strong>[C6E]</strong> видел свой реальный прогресс от игры к игре, а старание на праках и турнирах вознаграждалось звонкой Голдой. Заходите на сайт каждый день, прожимайте бусты, разрывайте соперников в Табе и забирайте <code>500</code>, <code>250</code> и <code>150 GOLD</code> в конце недели!»
      <div style="margin-top:8px; font-style:normal; font-family:'Orbitron',sans-serif; font-size:10px; font-weight:800; color:#ffb300; letter-spacing:1px;">
        — KAS (@kas_0ff) // ОСНОВАТЕЛЬ И ГЛАВНЫЙ РАЗРАБОТЧИК CYBER 6 ESPORTS [C6E]
      </div>
    </blockquote>
  `
};

let currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
let cachedFirestoreNewsList = [];

function getMergedNewsFeedList() {
  const list = Array.isArray(cachedFirestoreNewsList) ? [...cachedFirestoreNewsList] : [];
  const hasCurrentRelease = list.some(n =>
    (n.versionId && n.versionId === currentActiveRelease.versionId) ||
    (n.title && currentActiveRelease.title && n.title.trim() === currentActiveRelease.title.trim())
  );
  if (!hasCurrentRelease && currentActiveRelease && currentActiveRelease.title) {
    list.push({
      id: currentActiveRelease.id || 1763000450000,
      versionId: currentActiveRelease.versionId,
      title: currentActiveRelease.title,
      text: currentActiveRelease.text,
      date: currentActiveRelease.date || new Date().toLocaleDateString('ru-RU'),
      tag: currentActiveRelease.tag || 'ОБНОВЛЕНИЕ'
    });
  }
  list.sort((a, b) => (a.id || 0) - (b.id || 0));
  return list;
}

function renderPublicNewsFeeds() {
  const list = getMergedNewsFeedList();

  const homeFeed = document.getElementById('home-news-feed');
  if (homeFeed) {
    if (!list.length) {
      homeFeed.innerHTML = '<div class="text-center" style="font-size:11px; color:#666; padding:20px;">Новостей пока нет</div>';
    } else {
      homeFeed.innerHTML = list.slice().reverse().slice(0, 3).map(n => {
        const isUpdate = (n.tag || '').toUpperCase() === 'ОБНОВЛЕНИЕ' || Boolean(n.versionId);
        return `
          <div class="news-card-home" onclick="selectTab('news', document.getElementById('btn-news'))" style="cursor:pointer; ${isUpdate ? 'border-left:3px solid #ffb300; background:linear-gradient(90deg, rgba(255,179,0,0.08), transparent);' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <span style="color:${isUpdate ? '#ffb300' : 'var(--accent-light)'}; font-size:9px; font-weight:800; font-family:var(--font-tech);">
                ${isUpdate ? '⚡ ' : ''}${escapeHTML(n.tag || 'LIVE')}
              </span>
              <span style="color: var(--silver-muted); font-size: 9px;">${escapeHTML(n.date)}</span>
            </div>
            <div style="font-family: var(--font-tech); font-size: 13px; color: var(--silver); line-height:1.4;">
              ${escapeHTML(n.title)}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const fullFeed = document.getElementById('dynamic-news-container');
  if (fullFeed) {
    if (!list.length) {
      fullFeed.innerHTML = '<div class="card text-center" style="color:#666;">Лента новостей пуста</div>';
    } else {
      fullFeed.innerHTML = list.slice().reverse().map(n => {
        const isUpdate = (n.tag || '').toUpperCase() === 'ОБНОВЛЕНИЕ' || Boolean(n.versionId);
        return `
          <div class="card" style="border-left: 3px solid ${isUpdate ? '#ffb300' : 'var(--accent-light)'}; ${isUpdate ? 'box-shadow: 0 12px 35px rgba(255,179,0,0.08);' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
              <div style="font-size:10px; color:${isUpdate ? '#ffb300' : 'var(--accent-light)'}; font-weight:700; font-family:var(--font-tech);">
                ${escapeHTML(n.date)} <span style="color:var(--silver); opacity:0.8;">[${escapeHTML(n.tag || 'NEWS')}]</span>
              </div>
              ${isUpdate ? `<span style="font-family:var(--font-tech); font-size:9px; font-weight:800; color:#00e676; background:rgba(0,230,118,0.1); border:1px solid rgba(0,230,118,0.35); padding:3px 9px; border-radius:20px;"><i class="fas fa-code"></i> DEV: KAS (@kas_0ff)</span>` : ''}
            </div>
            <h2 style="font-family: var(--font-tech); font-size: 17px; margin: 0 0 14px 0; color: #fff; line-height:1.35;">${escapeHTML(n.title)}</h2>
            <div style="font-size: 13px; color: #ccc; line-height: 1.65;">${n.text}</div>
          </div>
        `;
      }).join('');
    }
  }

  if (list.length > 0) {
    const latestId = Math.max(...list.map(i => i.id || 0));
    checkUpdateBadge('news', latestId, 'btn-news');
  }
}

function ensureReleaseModalDOM() {
  if (document.getElementById('c6e-release-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'c6e-release-modal';
  modal.className = 'c6e-modal-overlay';
  modal.style.zIndex = '10005';
  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeSiteReleaseModal(true);
  });
  document.body.appendChild(modal);
}

window.openSiteReleaseModal = (relObj = null) => {
  if (checkIfCurrentUserBanned()) return;
  ensureReleaseModalDOM();
  const rel = relObj || currentActiveRelease || DEFAULT_KAS_RELEASE;
  const modal = document.getElementById('c6e-release-modal');
  if (!modal) return;

  const heroBtn = document.getElementById('hero-patch-btn');
  if (heroBtn && rel.versionLabel) {
    heroBtn.innerHTML = `<i class="fas fa-bolt" style="margin-right: 8px;"></i> ОБНОВА ${escapeHTML(rel.versionLabel.split(' ')[0])} ОТ KAS`;
  }

  modal.innerHTML = `
    <div class="c6e-modal-card" style="max-width:650px; border-top:3px solid #ffb300; box-shadow:0 25px 75px rgba(0,0,0,0.95), 0 0 40px rgba(255,179,0,0.18);">
      <div class="c6e-modal-head" style="background:linear-gradient(135deg, rgba(255,179,0,0.16), rgba(158,27,40,0.22));">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="background:#ffb300; color:#000; font-family:var(--font-tech); font-size:9px; font-weight:900; padding:4px 9px; border-radius:6px; letter-spacing:1px;">
            🚀 НОВОЕ ОБНОВЛЕНИЕ САЙТА
          </span>
          <span style="font-family:var(--font-tech); font-size:10px; color:#00e676; font-weight:800;">
            ${escapeHTML(rel.versionLabel || 'v4.5')}
          </span>
        </div>
        <button type="button" class="c6e-modal-close" onclick="window.closeSiteReleaseModal(true)">✕</button>
      </div>

      <div class="c6e-modal-body" style="max-height:70vh; overflow-y:auto;">
        <h3 style="font-family:var(--font-tech); font-size:16px; color:#fff; margin:0 0 12px 0; line-height:1.35;">
          ${escapeHTML(rel.title)}
        </h3>
        <div style="font-size:13px; color:#ccc; line-height:1.65;">
          ${rel.text}
        </div>
      </div>

      <div style="padding:14px 18px; background:rgba(10,11,15,0.96); border-top:1px solid rgba(255,255,255,0.08); display:flex; gap:8px; flex-wrap:wrap; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="boost-btn" style="width:auto; padding:10px 14px;" onclick="window.closeSiteReleaseModal(true); selectTab('pantheon', document.getElementById('btn-pantheon'));">
            <i class="fas fa-crown"></i> ОТКРЫТЬ ПАНТЕОН (900G)
          </button>
          <button type="button" class="report-mini-btn" style="padding:10px 14px;" onclick="window.closeSiteReleaseModal(true); selectTab('news', document.getElementById('btn-news'));">
            <i class="fas fa-newspaper"></i> В НОВОСТИ
          </button>
        </div>
        <button type="button" class="report-mini-btn" style="padding:10px 16px; border-color:#00e676; color:#00e676;" onclick="window.closeSiteReleaseModal(true);">
          <i class="fas fa-check"></i> ПРИНЯТО, KAS!
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

window.closeSiteReleaseModal = (markSeen = true) => {
  const modal = document.getElementById('c6e-release-modal');
  if (modal) modal.classList.remove('active');
  if (markSeen && currentActiveRelease && currentActiveRelease.versionId) {
    try {
      localStorage.setItem('c6e_seen_release_v', currentActiveRelease.versionId);
    } catch (e) {}
  }
};

function checkAndShowReleaseNotification() {
  if (!currentActiveRelease || !currentActiveRelease.versionId) return;
  let seenVer = null;
  try {
    seenVer = localStorage.getItem('c6e_seen_release_v');
  } catch (e) {}

  const heroBtn = document.getElementById('hero-patch-btn');
  if (heroBtn && currentActiveRelease.versionLabel) {
    heroBtn.innerHTML = `<i class="fas fa-bolt" style="margin-right: 8px;"></i> ОБНОВА ${escapeHTML(currentActiveRelease.versionLabel.split(' ')[0])} ОТ KAS`;
  }

  if (seenVer !== currentActiveRelease.versionId) {
    setTimeout(() => {
      if (!checkIfCurrentUserBanned()) {
        window.openSiteReleaseModal(currentActiveRelease);
        if (window.showNotify) {
          window.showNotify(`🚀 Вышло обновление сайта от Kas: ${currentActiveRelease.versionLabel || 'v4.5'}!`, 'success');
        }
      }
    }, 1350);
  }
}

onSnapshot(doc(db, DB_COLLECTION, "site_release"), (snap) => {
  if (snap.exists() && snap.data().versionId && snap.data().title) {
    currentActiveRelease = {
      ...DEFAULT_KAS_RELEASE,
      ...snap.data()
    };
  } else {
    currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
  }
  renderPublicNewsFeeds();
  checkAndShowReleaseNotification();
}, () => {
  // Если документ site_release еще не создан в базе, показываем встроенный релиз v4.5 от Kas
  currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
  renderPublicNewsFeeds();
  checkAndShowReleaseNotification();
});

onSnapshot(doc(db, DB_COLLECTION, "news"), (snap) => {
  cachedFirestoreNewsList = (snap.exists() && snap.data().list) ? snap.data().list : [];
  renderPublicNewsFeeds();
});

let timerInterval;
onSnapshot(doc(db, DB_COLLECTION, "match"), (snap) => {
  if (snap.exists()) {
    const data = snap.data();
    const enemyEl = document.getElementById('enemy-name-display');
    if (enemyEl) enemyEl.innerText = escapeHTML(data.enemy || "TBA");
    if (data.date && data.enemy) startTimer(data.date);
    else stopTimer("ОЖИДАНИЕ АНОНСА...");
  }
});

function stopTimer(msg) {
  if (timerInterval) clearInterval(timerInterval);
  const cdEl = document.getElementById('countdown');
  const stEl = document.getElementById('match-status');
  if (cdEl) cdEl.innerHTML = `<span style="font-size:12px; color:var(--silver-muted);">${msg}</span>`;
  if (stEl) { stEl.innerText = "OFFLINE"; stEl.style.background = "#333"; stEl.style.color = "#fff"; }
}

function startTimer(isoDate) {
  if (timerInterval) clearInterval(timerInterval);
  const target = new Date(isoDate).getTime();

  const update = () => {
    const now = new Date().getTime();
    const diff = target - now;
    const statusEl = document.getElementById('match-status');
    const cdEl = document.getElementById('countdown');
    if (!statusEl || !cdEl) return;

    if (diff < 0) {
      statusEl.innerText = "LIVE";
      statusEl.style.background = "var(--accent-light)";
      statusEl.style.color = "#fff";
      cdEl.innerHTML = "<span style='font-size:15px; font-weight:700; color:var(--accent-light);'>МАТЧ НАЧАЛСЯ</span>";
      clearInterval(timerInterval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    cdEl.innerHTML = `
      <div class="text-center"><div class="cd-num">${d}</div><div class="cd-lbl">DAYS</div></div>
      <div style="font-size:24px; padding-bottom:15px; color:#444;">:</div>
      <div class="text-center"><div class="cd-num">${h}</div><div class="cd-lbl">HRS</div></div>
      <div style="font-size:24px; padding-bottom:15px; color:#444;">:</div>
      <div class="text-center"><div class="cd-num">${m}</div><div class="cd-lbl">MIN</div></div>
    `;
    statusEl.innerText = "UPCOMING";
    statusEl.style.background = "var(--silver)";
    statusEl.style.color = "#000";
  };
  update();
  timerInterval = setInterval(update, 1000);
}

window.selectPracSlot = (id, cardEl) => {
  document.getElementById('prac-slot-select').value = id;
  document.querySelectorAll('.slot-card').forEach(c => c.classList.remove('selected'));
  if (cardEl) cardEl.classList.add('selected');
};

onSnapshot(doc(db, DB_COLLECTION, "practices"), (snap) => {
  const slotsGrid = document.getElementById('prac-slots-grid');
  const publicList = document.getElementById('public-booked-list');
  const hiddenInput = document.getElementById('prac-slot-select');

  if (!snap.exists() || !snap.data().list) {
    if (slotsGrid) slotsGrid.innerHTML = '<div style="font-size:12px; color:#666; padding:12px; grid-column:1/-1; text-align:center;">Свободных слотов на данный момент нет</div>';
    if (publicList) publicList.innerHTML = '<div style="font-size:11px; color:#666; text-align:center; padding:10px;">Расписание чисто</div>';
    return;
  }

  const allSlots = snap.data().list;
  allSlots.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));

  const openSlots = allSlots.filter(s => s.status === 'open' && new Date(s.isoDate) > new Date());
  if (slotsGrid) {
    if (!openSlots.length) {
      slotsGrid.innerHTML = '<div style="font-size:12px; color:var(--silver-muted); padding:15px; grid-column:1/-1; text-align:center; border:1px dashed var(--glass-border); border-radius:8px;">Сейчас все слоты заняты. Загляните чуть позже!</div>';
      if (hiddenInput) hiddenInput.value = '';
    } else {
      slotsGrid.innerHTML = openSlots.map((s, idx) => `
        <div class="slot-card ${idx === 0 ? 'selected' : ''}" onclick="window.selectPracSlot(${s.id}, this)">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:9px; color:var(--success); font-family:var(--font-tech);"><i class="fas fa-circle" style="font-size:6px;"></i> СВОБОДЕН</span>
            <span style="font-size:9px; background:var(--accent-dim); border:1px solid var(--accent); padding:2px 6px; border-radius:4px; color:var(--silver); font-family:var(--font-tech);">${escapeHTML(s.format || 'BO1')}</span>
          </div>
          <div class="slot-time">${escapeHTML(s.displayTime)}</div>
          <div style="font-size:10px; color:var(--silver-muted); margin-top:4px; display:flex; justify-content:space-between;">
            <span><i class="fas fa-server"></i> ${escapeHTML(s.server || 'Россия, Москва')}</span>
            <span style="color:var(--accent-light); font-weight:700;">ВЫБРАТЬ ➔</span>
          </div>
        </div>
      `).join('');
      if (hiddenInput) hiddenInput.value = openSlots[0].id;
    }
  }

  const bookedSlots = allSlots.filter(s => s.status === 'booked');
  if (publicList) {
    publicList.innerHTML = !bookedSlots.length
      ? '<div style="font-size:11px; color:#666; text-align:center; padding:12px;">Подтвержденных праков пока нет</div>'
      : bookedSlots.map(s => {
          const maps = (s.team && s.team.maps) ? s.team.maps.join(', ') : 'TBA';
          return `
            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--glass-border); border-left:3px solid var(--accent-light); border-radius:8px; padding: 12px 14px; margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <span style="color:var(--silver); font-size:11px; font-weight:700;"><i class="far fa-calendar-check text-accent"></i> ${escapeHTML(s.displayTime)}</span>
                <span style="font-size:9px; padding:2px 8px; background:var(--accent-dim); border:1px solid var(--accent); color:var(--silver); border-radius:4px; font-family:var(--font-tech);">CONFIRMED • ${escapeHTML(s.format || 'BO1')}</span>
              </div>
              <div style="margin-top:6px; font-family:var(--font-tech); font-size:15px; font-weight:800; color:#fff;">
                [C6E] <span style="color:var(--accent-light);">VS</span> ${escapeHTML(s.team ? s.team.clanName : 'TBA')}
              </div>
              <div style="font-size:10px; color:var(--silver-muted); margin-top:4px;">
                <i class="fas fa-map"></i> Карты: <span style="color:var(--silver);">${escapeHTML(maps)}</span>
              </div>
            </div>
          `;
        }).join('');
  }
});

window.filterSchedule = (type, btn) => {
  currentScheduleFilter = type;
  document.querySelectorAll('#schedule .sub-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderScheduleGrid();
};

function renderScheduleGrid() {
  const grid = document.getElementById('dynamic-schedule-grid');
  if (!grid) return;

  const filtered = currentScheduleFilter === 'all'
    ? allScheduleData
    : allScheduleData.filter(item => {
        if (item.type) return item.type === currentScheduleFilter;
        const txt = (item.event || '').toLowerCase();
        if (currentScheduleFilter === 'CW') return txt.includes('прак') || txt.includes('cw');
        if (currentScheduleFilter === 'CUP') return txt.includes('турнир') || txt.includes('cup');
        if (currentScheduleFilter === 'TRAIN') return txt.includes('трен') || txt.includes('train');
        return true;
      });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="card text-center" style="grid-column: 1/-1; color: #666;">В этой категории пока нет запланированных событий</div>';
    return;
  }

  const groupedData = {};
  filtered.forEach(item => {
    const dayKey = item.day || 'ДЕНЬ';
    if (!groupedData[dayKey]) groupedData[dayKey] = [];
    groupedData[dayKey].push(item);
  });

  let fullHtml = '';
  Object.keys(groupedData).forEach(dayName => {
    const events = groupedData[dayName];
    const eventsHtml = events.map(ev => {
      let typeClass = 'type-train';
      let badgeHtml = `<span class="tag-badge bg-train">${escapeHTML(ev.type || 'OPS')}</span>`;
      const txt = (ev.event || '').toLowerCase();

      if (ev.type === 'CW' || txt.includes('прак') || txt.includes('cw')) {
        typeClass = 'type-pracc';
        badgeHtml = '<span class="tag-badge bg-pracc">CW</span>';
      } else if (ev.type === 'CUP' || txt.includes('турнир') || txt.includes('cup')) {
        typeClass = 'type-tour';
        badgeHtml = '<span class="tag-badge bg-tour">CUP</span>';
      }

      if (ev.status === 'live') {
        badgeHtml = '<span class="tag-badge bg-live">🔴 LIVE</span>';
      } else if (ev.status === 'done') {
        badgeHtml = '<span class="tag-badge" style="background:rgba(0,230,118,0.15); color:var(--success);">✓ DONE</span>';
      }

      let statusStyle = '';
      if (ev.status === 'done') statusStyle = 'opacity: 0.6;';
      if (ev.status === 'canceled') statusStyle = 'border-left-color: var(--accent-light); opacity: 0.5; text-decoration: line-through;';

      return `
        <div class="event-item ${typeClass}" style="${statusStyle}">
          <span class="event-time">${escapeHTML(ev.time)}</span>
          <div class="event-info">
            <span class="event-name">${escapeHTML(ev.event)}</span>
          </div>
          ${badgeHtml}
        </div>
      `;
    }).join('');

    fullHtml += `
      <div class="day-card">
        <div class="day-header">
          <span class="day-title"><i class="far fa-calendar-alt text-accent" style="margin-right:6px;"></i> ${escapeHTML(dayName)}</span>
        </div>
        <div class="events-list">
          ${eventsHtml}
        </div>
      </div>
    `;
  });

  grid.innerHTML = fullHtml;
}

onSnapshot(doc(db, DB_COLLECTION, "schedule"), (snap) => {
  allScheduleData = (snap.exists() && snap.data().list) ? snap.data().list : [];
  renderScheduleGrid();
});

// =========================================================
// 6. ИСТОРИЯ МАТЧЕЙ + ПЕРЕСЧЕТ РОСТЕРА И ПАНТЕОНА
// =========================================================

window.filterHistory = (mode, btn) => {
  currentHistoryFilter = mode;
  document.querySelectorAll('#history .sub-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHistoryList();
};

window.toggleMatchDrawer = (id) => {
  const el = document.getElementById('drawer-' + id);
  if (el) el.classList.toggle('open');
};

function buildSo2TeamTableHTML(teamTitle, sideText, roundsScore, playersList, isOurTeam) {
  if (!playersList || !playersList.length) return '';

  const rowsHtml = playersList.map((p, idx) => {
    const k = parseInt(p.kills, 10) || 0;
    const a = parseInt(p.assists, 10) || 0;
    const d = parseInt(p.deaths, 10) || 0;
    const kd = p.kd || (d > 0 ? (k / d).toFixed(2) : k.toFixed(2));
    const sc = p.score !== undefined ? p.score : (k * 2 + a);
    const pg = p.ping !== undefined ? p.ping : 40;
    const kdColor = parseFloat(kd) >= 1.0 ? 'var(--success)' : 'var(--accent-light)';

    return `
      <tr>
        <td style="color:#777; font-size:10px;">${idx + 1}</td>
        <td class="col-name">${formatPlayerNickHTML(p.nick, isOurTeam)}</td>
        <td style="color:#fff; font-weight:700;">${k}</td>
        <td style="color:#9ca0a8;">${a}</td>
        <td style="color:#9ca0a8;">${d}</td>
        <td style="font-family:var(--font-tech); font-weight:800; color:${kdColor};">${escapeHTML(kd)}</td>
        <td style="color:var(--warning); font-weight:700;">${sc}</td>
        <td style="color:#777; font-size:10px;">${pg}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="so2-team-panel">
      <div class="so2-team-header ${isOurTeam ? 'c6e-head' : 'enemy-head'}">
        <div>
          <span style="color:#fff;">${escapeHTML(teamTitle)}</span>
          <span style="font-size:9px; color:var(--silver-muted); display:block; font-weight:500; margin-top:2px;">${escapeHTML(sideText)}</span>
        </div>
        <div style="font-size:20px; color:${isOurTeam ? 'var(--silver)' : '#9ec8ff'};">${escapeHTML(roundsScore)}</div>
      </div>
      <div class="so2-table-wrap">
        <table class="so2-table">
          <thead>
            <tr>
              <th style="width:22px;">#</th>
              <th class="col-name">Имя</th>
              <th>У</th>
              <th>П</th>
              <th>С</th>
              <th>K/D</th>
              <th>Счет</th>
              <th>Пинг</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderHistoryList() {
  const cont = document.getElementById('full-history-container');
  if (!cont) return;

  let list = [...allHistoryData].reverse();
  if (currentHistoryFilter === 'win') {
    list = list.filter(m => parseInt(m.our, 10) > parseInt(m.their, 10));
  } else if (currentHistoryFilter === 'proof') {
    list = list.filter(m => (m.proofImg && m.proofImg.length > 5) || (m.players && m.players.length > 0));
  }

  if (list.length === 0) {
    cont.innerHTML = '<div class="card text-center" style="color:#666;">Матчей по выбранному фильтру пока нет</div>';
    return;
  }

  cont.innerHTML = list.map(m => {
    const ourScore = parseInt(m.our, 10) || 0;
    const theirScore = parseInt(m.their, 10) || 0;
    const isWin = ourScore > theirScore;
    const color = isWin ? 'var(--success)' : 'var(--accent-light)';
    const statusText = isWin ? 'ПОБЕДА [C6E]' : 'ПОРАЖЕНИЕ';

    const hasProof = m.proofImg && m.proofImg.length > 5;
    const ourPlayers = m.players || [];
    const enemyPlayers = m.enemyPlayers || [];
    const hasAnyStats = ourPlayers.length > 0 || enemyPlayers.length > 0;

    let enemyMvpText = '';
    if (enemyPlayers.length > 0) {
      const topEnemy = [...enemyPlayers].sort((a, b) => (parseFloat(b.kd) || 0) - (parseFloat(a.kd) || 0))[0];
      if (topEnemy) {
        const ekd = topEnemy.kd || (topEnemy.deaths > 0 ? (topEnemy.kills / topEnemy.deaths).toFixed(2) : topEnemy.kills);
        enemyMvpText = `${topEnemy.nick} (${ekd} K/D • ${topEnemy.kills} У)`;
      }
    }

    const ourTableHtml = buildSo2TeamTableHTML(
      '[C6E] CYBER 6 ESPORTS',
      m.ourSide || 'АТАКА (Т)',
      ourScore,
      ourPlayers,
      true
    );

    const enemyTableHtml = buildSo2TeamTableHTML(
      m.enemy || 'СОПЕРНИК',
      m.theirSide || 'ОБОРОНА (СТ)',
      theirScore,
      enemyPlayers,
      false
    );

    const proofImgHtml = hasProof ? `
      <div style="margin-top:14px;">
        <div style="font-size:10px; font-family:var(--font-tech); color:var(--success); margin-bottom:6px;">
          <i class="fas fa-camera-retro"></i> ОРИГИНАЛЬНЫЙ СКРИНШОТ ТАБА STANDOFF 2 (НАЖМИ ДЛЯ УВЕЛИЧЕНИЯ):
        </div>
        <img src="${m.proofImg}" class="proof-thumb-img" alt="Standoff 2 Scoreboard Proof" onclick="window.openProofLightbox('${m.proofImg}')">
      </div>
    ` : '';

    return `
      <div class="history-match-card" style="border-left: 4px solid ${color};">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom: 6px;">
              <span class="tag-c6e" style="font-size:10px; padding:2px 7px;">[C6E]</span>
              <span style="font-size:9px; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:4px; color:var(--silver); font-family:var(--font-tech);">${escapeHTML(m.tour || 'Турнир')}</span>
              <span style="font-size:9px; background:var(--accent-dim); border:1px solid var(--accent); padding:3px 8px; border-radius:4px; color:var(--silver); font-family:var(--font-tech);"><i class="fas fa-map-marker-alt text-accent"></i> ${escapeHTML(m.map || 'Dune')}</span>
            </div>
            <div style="font-family: var(--font-tech); font-size: 16px; font-weight: 800; color: #fff;">
              [C6E] CYBER 6 <span style="color:var(--accent-light);">VS</span> ${escapeHTML(m.enemy)}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-family: var(--font-tech); font-size: 26px; font-weight: 900; color: ${color}; line-height:1;">
              ${ourScore} : ${theirScore}
            </div>
            <div style="font-size: 9px; color: ${color}; font-weight: 800; font-family: var(--font-tech); letter-spacing:1px; margin-top:4px;">
              ${statusText}
            </div>
          </div>
        </div>

        <div class="so2-bottom-bar">
          <span><i class="fas fa-globe-europe text-accent"></i> ${escapeHTML(m.tour || 'Турнир')} / ${escapeHTML(m.map || 'Dune')} / ${escapeHTML(m.server || 'Россия, Москва')}</span>
          <span><i class="far fa-clock"></i> ${escapeHTML(m.date || 'Сегодня')}</span>
        </div>

        ${(hasProof || hasAnyStats) ? `
          <div style="margin-top: 12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <span style="font-size:10px; color:var(--silver-muted);">
              ${hasAnyStats ? `<i class="fas fa-list-ol text-accent"></i> Полный Таб (${ourPlayers.length + enemyPlayers.length} игроков)` : ''}
              ${hasProof ? ' • <i class="fas fa-check-circle" style="color:var(--success);"></i> Скриншот-доказательство' : ''}
            </span>
            <button type="button" class="btn-glitch" style="width:auto; padding:8px 16px; font-size:10px;" onclick="window.toggleMatchDrawer(${m.id})">
              <i class="fas fa-table" style="margin-right:6px;"></i> ОТКРЫТЬ ТАБ ИГРОКОВ И СКРИНШОТ
            </button>
          </div>

          <div id="drawer-${m.id}" class="match-proof-drawer">
            ${(m.mvp || enemyMvpText) ? `
              <div class="mvp-compare-bar">
                ${m.mvp ? `
                  <div class="mvp-card" style="border-left:3px solid var(--warning);">
                    <i class="fas fa-crown" style="color:var(--warning); font-size:16px;"></i>
                    <div>
                      <div style="font-size:9px; color:var(--silver-muted); text-transform:uppercase; font-weight:700;">MVP НАШЕЙ КОМАНДЫ [C6E]</div>
                      <div style="font-weight:700; color:#fff;">${escapeHTML(m.mvp)}</div>
                    </div>
                  </div>
                ` : ''}
                ${enemyMvpText ? `
                  <div class="mvp-card" style="border-left:3px solid #5ea8ff;">
                    <i class="fas fa-crosshairs" style="color:#5ea8ff; font-size:16px;"></i>
                    <div>
                      <div style="font-size:9px; color:var(--silver-muted); text-transform:uppercase; font-weight:700;">ЛИДЕР ПРОТИВНИКА</div>
                      <div style="font-weight:700; color:#fff;">${escapeHTML(enemyMvpText)}</div>
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <div class="so2-tab-grid">
              ${ourTableHtml}
              ${enemyTableHtml}
            </div>

            ${proofImgHtml}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

onSnapshot(doc(db, DB_COLLECTION, "history"), (snap) => {
  const list = (snap.exists() && snap.data().list) ? snap.data().list : [];
  allHistoryData = list;

  let wins = 0;
  list.forEach(m => {
    if (parseInt(m.our, 10) > parseInt(m.their, 10)) wins++;
  });

  const total = list.length;
  const rate = total > 0 ? Math.round((wins / total) * 100) : 0;

  const wrEl = document.getElementById('win-rate-display');
  const totEl = document.getElementById('total-games-display');
  if (wrEl) wrEl.innerText = `${rate}%`;
  if (totEl) totEl.innerText = total;

  renderHistoryList();
  renderAllRosters();
  renderPantheonSection();
});

// --- ROADMAP, МЕДИА, ОТЗЫВЫ ---
onSnapshot(doc(db, DB_COLLECTION, "about"), (snap) => {
  const list = (snap.exists() && snap.data().roadmap) ? snap.data().roadmap : [];
  const cont = document.getElementById('roadmap-container');
  if (cont) {
    if (!list.length) {
      cont.innerHTML = '<div class="text-center" style="color:#666; font-size:12px;">История заполняется...</div>';
      return;
    }
    cont.innerHTML = '<div style="position:absolute; left:6px; top:0; bottom:0; width:2px; background:linear-gradient(180deg, var(--silver), var(--accent), transparent);"></div>' +
      list.map(r => `
        <div style="position:relative; margin-bottom:25px; padding-left:15px;">
          <div style="position:absolute; left:-18px; top:2px; width:10px; height:10px; background:var(--bg-deep); border:2px solid var(--accent-light); border-radius:50%; z-index:2;"></div>
          <div style="font-size:10px; color:var(--accent-light); font-family:var(--font-tech);">${escapeHTML(r.date)}</div>
          <div style="font-weight:700; font-size:14px; color:var(--silver); margin:2px 0;">${escapeHTML(r.title)}</div>
          <div style="font-size:12px; color:var(--text-gray);">${escapeHTML(r.desc)}</div>
        </div>
      `).join('');
  }
});

onSnapshot(doc(db, DB_COLLECTION, "media"), (snap) => {
  if (!snap.exists()) return;
  const d = snap.data();
  const vidCont = document.getElementById('video-container');
  if (vidCont && d.videoId) {
    vidCont.innerHTML = `<iframe style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" src="https://www.youtube.com/embed/${escapeHTML(d.videoId)}?rel=0&modestbranding=1" allowfullscreen></iframe>`;
  }
  const galCont = document.getElementById('gallery-container');
  if (galCont && d.gallery && d.gallery.length) {
    galCont.innerHTML = d.gallery.map(g => `
      <div style="background: url('${g.src}') center/cover; height: 110px; border-radius: 6px; cursor: pointer; border:1px solid var(--glass-border); transition:0.3s;" onclick="window.openProofLightbox('${g.src}')"></div>
    `).join('');
    const latest = Math.max(...d.gallery.map(i => i.id || 0));
    checkUpdateBadge('media', latest, 'btn-media');
  }
});

onSnapshot(doc(db, DB_COLLECTION, "reviews"), (snap) => {
  const list = (snap.exists() && snap.data().list) ? snap.data().list : [];
  const el = document.getElementById('reviews-container');
  if (el) {
    el.innerHTML = list.slice().reverse().map(r => `
      <div class="card" style="padding: 15px; margin-bottom: 12px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
          <span style="color:var(--silver); font-weight:700;">${escapeHTML(r.nick)}</span>
          <span style="color:var(--accent-light); font-size:11px;">для ${escapeHTML(r.target)}</span>
        </div>
        <div style="font-size:13px; color:#ccc; font-style:italic;">"${escapeHTML(r.text)}"</div>
      </div>
    `).join('');
  }
});

// =========================================================
// 7. ОТПРАВКА ФОРМ (ЗАЩИЩЕНО СИСТЕМОЙ C6E SHIELD + ЗАПИСЬ МАТОВ)
// =========================================================

window.sendToTelegram = async (e) => {
  e.preventDefault();
  if (checkIfCurrentUserBanned()) return;
  if (!checkCooldown('last_join_submit', 15)) {
    return window.showNotify("Анкета уже отправлена! Подождите 15 минут.", "error");
  }

  const btn = e.target.querySelector('button');
  const originalText = btn.innerText;

  const nick = document.getElementById('nick').value.trim();
  const tg = document.getElementById('tg_username').value.trim();

  if (nick.length < 2 || tg.length < 2) {
    window.showNotify("Заполните корректно Ник и TG!", "error");
    return;
  }

  if (containsSpam(nick) || containsSpam(tg)) {
    const badWord = findMatchedSpamWord(nick + ' ' + tg);
    logSecurityEvent("⚠️ СПАМ / МАТ (АНКЕТА)", nick || "Аноним", `Заблокирована попытка отправить запрещённое слово («${badWord}») в анкете: Ник=${nick}, TG=${tg}`, true);
    return window.showNotify("Обнаружены запрещенные слова! Нарушение зафиксировано C6E Shield.", "error");
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> ПРОВЕРКА C6E SHIELD...';

  await resolveClientIp();

  const data = {
    nick: escapeHTML(nick),
    hours: escapeHTML(document.getElementById('hours').value),
    role: escapeHTML(document.getElementById('role').value),
    rank: escapeHTML(document.getElementById('best_rank').value),
    tg: escapeHTML(tg)
  };

  try {
    await logSecurityEvent("ЗАЯВКА В КЛУБ", nick, `TG: ${tg} | Роль: ${data.role} | Часы: ${data.hours}`, false);

    const tgMsg = `📝 <b>НОВАЯ ЗАЯВКА В CYBER 6 ESPORTS [C6E]</b>\n\n` +
                  `👤 <b>Ник:</b> ${data.nick}\n` +
                  `⏳ <b>Часы:</b> ${data.hours}\n` +
                  `🎯 <b>Роль:</b> ${data.role}\n` +
                  `🏆 <b>Пик Ранг:</b> ${data.rank}\n` +
                  `✈️ <b>TG:</b> ${data.tg}\n` +
                  `────────────────────\n` +
                  `🛡 <b>Device ID:</b> <code>${clientSecurityMeta.deviceId}</code>\n` +
                  `🌐 <b>IP:</b> <code>${clientSecurityMeta.ip}</code>`;

    await sendToBot(TG_CONFIG.groupId, tgMsg);
    setCooldown('last_join_submit');
    window.showNotify("Заявка в [C6E] отправлена!", "success");
    e.target.reset();
  } catch (err) {
    window.showNotify("Ошибка отправки: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerText = originalText;
  }
};

window.submitPrac = async (e) => {
  e.preventDefault();
  if (checkIfCurrentUserBanned()) return;
  if (!checkCooldown('last_prac_submit', 10)) {
    return window.showNotify("Подождите 10 минут перед следующей заявкой.", "error");
  }

  const slotId = parseInt(document.getElementById('prac-slot-select').value, 10);
  const maps = Array.from(document.querySelectorAll('.map-check:checked')).map(cb => cb.value);

  const clanName = document.getElementById('pc-clan').value.trim();
  const captain = document.getElementById('pc-cap').value.trim();
  const capId = document.getElementById('pc-id').value.trim();
  const contact = document.getElementById('pc-contact').value.trim();
  const lineup = document.getElementById('pc-lineup').value.trim();

  if (!slotId) return window.showNotify("Нажмите на свободный слот времени выше!", "error");
  if (containsSpam(clanName) || containsSpam(lineup) || containsSpam(captain)) {
    const badWord = findMatchedSpamWord(`${clanName} ${captain} ${lineup}`);
    logSecurityEvent("⚠️ СПАМ / МАТ (ПРАКИ)", `${clanName || 'Клан'} (${captain || 'Капитан'})`, `Заблокирована попытка отправить слово («${badWord}») в праках: ${clanName} | ${lineup}`, true);
    return window.showNotify("Обнаружены запрещенные слова! Нарушение зафиксировано C6E Shield.", "error");
  }
  if (!/^\d{7,14}$/.test(capId)) return window.showNotify("ID должен содержать от 7 до 14 цифр!", "error");
  if (!/^@[a-zA-Z0-9_]{3,25}$/.test(contact)) return window.showNotify("TG должен начинаться с @!", "error");
  if (maps.length === 0) return window.showNotify("Выберите хотя бы одну карту!", "error");

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerText = "БРОНИРОВАНИЕ...";
  btn.disabled = true;

  await resolveClientIp();

  try {
    const ref = doc(db, DB_COLLECTION, "practices");
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("База слотов пуста");

    let list = snap.data().list;
    const idx = list.findIndex(s => s.id === slotId);
    if (idx === -1 || list[idx].status !== 'open') {
      throw new Error("Этот слот только что заняли!");
    }

    const slotObj = list[idx];
    list[idx].status = 'booked';
    list[idx].team = {
      clanName: escapeHTML(clanName),
      captain: escapeHTML(captain),
      capId: escapeHTML(capId),
      contact: escapeHTML(contact),
      format: slotObj.format || "BO1",
      maps: maps,
      lineup: escapeHTML(lineup),
      ip: clientSecurityMeta.ip,
      deviceId: clientSecurityMeta.deviceId,
      deviceInfo: clientSecurityMeta.deviceInfo
    };

    await updateDoc(ref, { list: list });
    await logSecurityEvent("ПРАК (CW)", `${clanName} (${captain})`, `TG: ${contact} | ID: ${capId} | Карты: ${maps.join(', ')}`, false);

    const d = new Date(slotObj.isoDate);
    const weekday = d.toLocaleDateString('ru-RU', { weekday: 'long' }).toUpperCase();
    const shortDate = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    const timeStr = d.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' });

    const schRef = doc(db, DB_COLLECTION, "schedule");
    const schSnap = await getDoc(schRef);
    const newSchItem = {
      id: Date.now(),
      day: `${weekday} / ${shortDate}`,
      time: timeStr,
      type: 'CW',
      event: `Прак: [C6E] VS ${escapeHTML(clanName)} (${slotObj.format || 'BO1'})`,
      status: 'upcoming'
    };
    if (!schSnap.exists()) await setDoc(schRef, { list: [newSchItem] });
    else await updateDoc(schRef, { list: arrayUnion(newSchItem) });

    setCooldown('last_prac_submit');

    const tgMsg = `⚔️ <b>[C6E] // НОВЫЙ ПРАК ЗАБРОНИРОВАН</b>\n` +
                  `────────────────────\n` +
                  `📅 <b>ВРЕМЯ:</b> <code>${slotObj.displayTime}</code>\n` +
                  `👥 <b>СОПЕРНИК:</b> <code>${escapeHTML(clanName)}</code>\n` +
                  `👤 <b>КАПИТАН:</b> ${escapeHTML(captain)} (ID: <code>${escapeHTML(capId)}</code>)\n` +
                  `📞 <b>СВЯЗЬ:</b> ${escapeHTML(contact)}\n` +
                  `🎮 <b>ФОРМАТ:</b> ${slotObj.format || 'BO1'}\n` +
                  `🗺 <b>КАРТЫ:</b> ${maps.join(', ')}\n` +
                  `📝 <b>СОСТАВ:</b> ${escapeHTML(lineup || 'Не указан')}`;

    await sendToBot(TG_CONFIG.channelId, tgMsg);
    window.showNotify("Прак забронирован и добавлен в Расписание!", "success");
    e.target.reset();
  } catch (err) {
    window.showNotify(err.message, "error");
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
};

window.submitReview = async (e) => {
  e.preventDefault();
  if (checkIfCurrentUserBanned()) return;
  if (!checkCooldown('last_review_submit', 30)) {
    return window.showNotify("Отзыв можно оставлять раз в 30 минут.", "error");
  }

  const nick = document.getElementById('rev-nick').value.trim();
  const target = document.getElementById('rev-target').value;
  const text = document.getElementById('rev-text').value.trim();

  if (text.length < 5) return window.showNotify("Отзыв слишком короткий!", "error");
  if (containsSpam(text) || containsSpam(nick)) {
    const badWord = findMatchedSpamWord(`${nick} ${text}`);
    logSecurityEvent("⚠️ СПАМ / МАТ (ОТЗЫВЫ)", nick || "Аноним", `Заблокирована попытка отправить запрещённое слово («${badWord}») в отзыве: "${text.slice(0, 80)}"`, true);
    return window.showNotify("Обнаружены запрещенные слова! Нарушение зафиксировано C6E Shield.", "error");
  }

  await resolveClientIp();

  try {
    const ref = doc(db, DB_COLLECTION, "reviews");
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, { list: [] });

    await updateDoc(ref, {
      list: arrayUnion({
        id: Date.now(),
        nick: escapeHTML(nick),
        target: escapeHTML(target),
        text: escapeHTML(text),
        ip: clientSecurityMeta.ip,
        deviceId: clientSecurityMeta.deviceId,
        deviceInfo: clientSecurityMeta.deviceInfo
      })
    });

    await logSecurityEvent("ОТЗЫВ", nick, `Кому: ${target} | Текст: ${text.slice(0, 80)}`, false);

    setCooldown('last_review_submit');
    window.showNotify("Отзыв опубликован!", "success");
    e.target.reset();
  } catch (err) {
    window.showNotify("Ошибка сети", "error");
  }
};

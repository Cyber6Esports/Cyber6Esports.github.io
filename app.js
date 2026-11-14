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

  /* =========================================================
     СТИЛИ ОБНОВЛЕНИЯ v0.5.0: ТЕМЫ, ШАПКА ПРОФИЛЯ, РАМКИ [C6E], ЧАТ, МАГАЗИН
     ========================================================= */
  html[data-theme="red"] {
    --accent: #9e1b28; --accent-light: #d42638;
    --accent-dim: rgba(158, 27, 40, 0.16); --accent-glow: rgba(212, 38, 56, 0.38);
  }
  html[data-theme="green"] {
    --accent: #0b6e4f; --accent-light: #00c885;
    --accent-dim: rgba(11, 110, 79, 0.18); --accent-glow: rgba(0, 200, 133, 0.38);
  }
  html[data-theme="gold"] {
    --accent: #9a6b00; --accent-light: #ffb300;
    --accent-dim: rgba(154, 107, 0, 0.18); --accent-glow: rgba(255, 179, 0, 0.38);
  }
  html[data-theme="blue"] {
    --accent: #1446a0; --accent-light: #3b82f6;
    --accent-dim: rgba(20, 70, 160, 0.18); --accent-glow: rgba(59, 130, 246, 0.38);
  }

  .c6e-modal-overlay {
    position: fixed; inset: 0; z-index: 12000;
    background: rgba(5, 6, 10, 0.94);
    display: none; align-items: center; justify-content: center; padding: 14px;
  }
  .c6e-modal-overlay.active { display: flex; }
  .c6e-modal-card {
    width: min(96vw, 600px); max-height: 90vh; overflow-y: auto;
    background: linear-gradient(180deg, #15171e 0%, #0b0c10 100%);
    border: 1px solid var(--silver-border); border-top: 3px solid var(--accent-light);
    border-radius: 16px; box-shadow: 0 25px 70px rgba(0,0,0,0.95);
    overflow: hidden; display: flex; flex-direction: column;
  }
  .c6e-modal-head {
    padding: 14px 18px; background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; justify-content: space-between; align-items: center; gap: 10px;
  }
  .c6e-modal-body { padding: 18px; overflow-y: auto; }
  .c6e-modal-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    color: var(--silver); cursor: pointer; font-size: 13px;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .c6e-modal-close:hover { background: var(--accent); color: #fff; }

  .nav-icon-btn {
    position: relative; width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
    color: var(--silver); display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: 0.25s;
  }
  .nav-icon-btn:hover { border-color: var(--accent-light); color: #fff; background: var(--accent-dim); }
  .notif-count-pill {
    position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px;
    padding: 0 4px; border-radius: 10px; background: var(--accent-light); color: #fff;
    font-family: var(--font-tech); font-size: 9px; font-weight: 900;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 0 10px var(--accent-glow);
  }

  .header-profile-chip {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 4px 10px 4px 5px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border);
    cursor: pointer; transition: 0.25s; max-width: 195px;
  }
  .header-profile-chip:hover { border-color: var(--accent-light); background: var(--accent-dim); }
  .hp-avatar-wrap {
    width: 32px; height: 32px; position: relative; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; padding: 2px;
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  }
  .hp-avatar-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    background: #0b0c0e;
  }
  .hp-info { min-width: 0; display: flex; flex-direction: column; line-height: 1.15; }
  .hp-nick {
    font-family: var(--font-tech); font-size: 10px; font-weight: 800; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .hp-sub {
    font-size: 8.5px; color: var(--silver-muted); font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  @media (max-width: 640px) {
    .navbar { height: 62px !important; padding: 0 8px !important; gap: 4px !important; width: 100% !important; max-width: 100vw !important; box-sizing: border-box !important; }
    .nav-brand { gap: 6px !important; flex-shrink: 1 !important; min-width: 0 !important; }
    .nav-brand img { width: 30px !important; height: 30px !important; flex-shrink: 0 !important; }
    .nav-brand h1 { font-size: 12.5px !important; letter-spacing: 0.5px !important; white-space: nowrap !important; }
    .nav-brand h1 span.six-num { font-size: 13.5px !important; }
    .nav-brand-sub { font-size: 6.5px !important; letter-spacing: 1px !important; white-space: nowrap !important; }
    .nav-top-actions { gap: 4px !important; margin-left: auto !important; margin-right: 2px !important; flex-shrink: 1 !important; min-width: 0 !important; }
    .header-profile-chip { max-width: 104px !important; min-width: 0 !important; flex-shrink: 1 !important; padding: 2px 6px 2px 3px !important; gap: 4px !important; border-radius: 9px !important; }
    .hp-avatar-wrap { width: 24px !important; height: 24px !important; flex-shrink: 0 !important; }
    .hp-nick { font-size: 8.5px !important; }
    .hp-sub { font-size: 6.8px !important; }
    .nav-icon-btn { width: 30px !important; height: 30px !important; font-size: 11.5px !important; border-radius: 8px !important; flex-shrink: 0 !important; }
    .menu-toggle { width: 34px !important; height: 34px !important; font-size: 16px !important; flex-shrink: 0 !important; margin-left: 2px !important; }
  }
  @media (max-width: 370px) {
    .nav-brand-sub { display: none !important; }
    .header-profile-chip { max-width: 88px !important; }
  }

  /* ГЕКСАГОНАЛЬНЫЕ РАМКИ В СТИЛЕ ЛОГОТИПА [C6E] */
  .c6e-hex-avatar {
    position: relative; display: inline-flex; align-items: center; justify-content: center;
    padding: 3px; flex-shrink: 0;
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    transition: 0.3s;
  }
  .c6e-hex-avatar img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    background: #0b0c0e;
  }
  .frame-c6e-red {
    background: linear-gradient(135deg, #ff2a40, #e4e4e2, #9e1b28);
    
  }
  .frame-c6e-gold {
    background: linear-gradient(135deg, #ffe066, #ffb300, #9a6b00);
    
  }
  .frame-c6e-green {
    background: linear-gradient(135deg, #00e676, #e4e4e2, #0b6e4f);
    
  }
  .frame-c6e-blue {
    background: linear-gradient(135deg, #60a5fa, #e4e4e2, #1d4ed8);
    
  }

  /* БАННЕРЫ ПРОФИЛЕЙ */
  .prof-banner-box {
    height: 118px; border-radius: 12px 12px 0 0; position: relative;
    background-size: cover; background-position: center; overflow: hidden;
    border-bottom: 2px solid var(--accent-light);
  }
  .banner-crimson {
    background: radial-gradient(circle at 80% 20%, rgba(212,38,56,0.55), transparent 60%),
                linear-gradient(135deg, #2a080d 0%, #0b0c10 60%, #4a0e17 100%);
  }
  .banner-gold {
    background: radial-gradient(circle at 80% 20%, rgba(255,179,0,0.5), transparent 60%),
                linear-gradient(135deg, #2d2004 0%, #0b0c10 60%, #4d3500 100%);
  }
  .banner-emerald {
    background: radial-gradient(circle at 80% 20%, rgba(0,230,118,0.45), transparent 60%),
                linear-gradient(135deg, #05291c 0%, #0b0c10 60%, #0b4630 100%);
  }
  .banner-sapphire {
    background: radial-gradient(circle at 80% 20%, rgba(59,130,246,0.5), transparent 60%),
                linear-gradient(135deg, #081c3a 0%, #0b0c10 60%, #10326b 100%);
  }

  /* ГЛАВНЫЙ ЭКРАН v0.5.0 И РАДАР ОНЛАЙНА */
  .cyber-hero-v5 {
    text-align: center; padding: 28px 18px; position: relative; overflow: hidden;
    background: radial-gradient(circle at 50% 0%, var(--accent-dim) 0%, rgba(14, 15, 20, 0.95) 75%);
    border-top: 2px solid var(--accent-light);
  }
  .hero-top-meta {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 8px; margin-bottom: 14px;
  }
  .hero-live-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px; font-family: var(--font-tech);
    font-size: 9px; font-weight: 800; color: var(--success);
    background: rgba(0, 230, 118, 0.1); border: 1px solid rgba(0, 230, 118, 0.35);
  }
  .hero-dev-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-family: var(--font-tech);
    font-size: 9px; font-weight: 800; color: #ffb300; cursor: pointer;
    background: rgba(255, 179, 0, 0.12); border: 1px solid rgba(255, 179, 0, 0.4);
  }
  .hero-quick-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    gap: 10px; margin-top: 16px;
  }
  .online-dot-pulse {
    width: 8px; height: 8px; border-radius: 50%; background: #00e676;
    display: inline-block; box-shadow: 0 0 10px #00e676;
    animation: pulse-logo 1.4s infinite;
  }

  .community-radar-card {
    border-top: 2px solid var(--accent-light);
    background: linear-gradient(160deg, rgba(18, 19, 25, 0.96), rgba(10, 11, 14, 0.98));
  }
  .community-radar-header {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px; padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 14px;
  }
  .community-counters-strip {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .comm-counter-pill {
    padding: 5px 11px; border-radius: 8px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 7px;
  }
  .comm-counter-pill .lbl { font-family: var(--font-tech); font-size: 8px; color: var(--silver-muted); }
  .comm-counter-pill .val { font-family: var(--font-tech); font-size: 13px; font-weight: 900; color: #fff; }
  .comm-counter-pill.online { border-color: rgba(0, 230, 118, 0.35); background: rgba(0, 230, 118, 0.06); }
  .comm-counter-pill.online .val { color: var(--success); }

  .online-profiles-showcase {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
    gap: 10px; max-height: 340px; overflow-y: auto; padding-right: 2px;
  }
  .mini-prof-card {
    border-radius: 11px; overflow: hidden; border: 1px solid rgba(255,255,255,0.09);
    background: rgba(12, 13, 18, 0.92); cursor: pointer; transition: 0.25s;
    position: relative; display: flex; flex-direction: column;
  }
  .mini-prof-card:hover {
    transform: translateY(-3px); border-color: var(--accent-light);
    box-shadow: 0 10px 24px rgba(0,0,0,0.7);
  }
  .mini-prof-top { height: 42px; background-size: cover; background-position: center; position: relative; }
  .mini-prof-body { padding: 0 11px 11px 11px; margin-top: -18px; position: relative; }

  /* ОБЩИЙ ЧАТ ИГРОКОВ (12Ч АВТО-ОЧИСТКА) */
  .chat-box-wrap {
    border-radius: 14px; border: 1px solid var(--silver-border);
    background: rgba(11, 12, 16, 0.96); overflow: hidden;
    display: flex; flex-direction: column; height: 68vh; min-height: 440px; max-height: 680px;
  }
  .chat-top-bar {
    padding: 12px 16px; background: linear-gradient(90deg, var(--accent-dim), rgba(15,16,22,0.98));
    border-bottom: 1px solid var(--glass-border);
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
  }
  .chat-messages-area {
    flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;
  }
  .chat-msg-item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 10px 12px; border-radius: 11px;
    background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06);
  }
  .chat-msg-item.mention-me {
    border-color: #ffb300; background: rgba(255, 179, 0, 0.09);
  }
  .chat-msg-item.is-mine {
    border-left: 3px solid var(--accent-light); background: rgba(255,255,255,0.04);
  }
  .chat-mention-tag {
    display: inline-block; padding: 1px 6px; border-radius: 4px;
    background: rgba(255, 179, 0, 0.2); border: 1px solid #ffb300;
    color: #ffb300; font-family: var(--font-tech); font-size: 10px; font-weight: 800;
  }
  .chat-input-bar {
    padding: 11px 14px; background: rgba(16, 17, 23, 0.98);
    border-top: 1px solid var(--glass-border); display: flex; gap: 8px; align-items: center;
  }

  /* РАЗДЕЛ МАГАЗИН [C6E] */
  .shop-vault-hero {
    border-radius: 16px; padding: 30px 22px; text-align: center;
    background: radial-gradient(circle at 50% 0%, var(--accent-dim), rgba(10,11,15,0.98) 75%);
    border: 1px solid var(--accent-light); box-shadow: 0 20px 55px rgba(0,0,0,0.85);
    position: relative; overflow: hidden; margin-bottom: 18px;
  }
  .shop-teaser-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px;
  }
  .shop-teaser-card {
    border-radius: 13px; padding: 18px; background: rgba(16, 17, 23, 0.92);
    border: 1px dashed rgba(255,255,255,0.16); position: relative;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: 0.3s;
  }
  .shop-teaser-card:hover { border-color: #ffb300; transform: translateY(-3px); }

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

const C6E_HOMO_MAP = {
  'а':'a','в':'b','с':'c','е':'e','н':'h','к':'k','м':'m',
  'о':'o','р':'p','т':'t','у':'y','х':'x','п':'n','и':'u',
  '0':'o','1':'i','l':'i','3':'e','6':'g','@':'a','4':'a'
};

function normalizeNickKey(nick) {
  if (!nick) return "";
  return String(nick)
    .replace(/^\[?[cс]6[eе]\]?\s*\|?\s*/i, '')
    .replace(/^\[[^\]]+\]\s*/, '')
    .replace(/\s+/g, '')
    .toLowerCase()
    .split('')
    .map(ch => C6E_HOMO_MAP[ch] || ch)
    .join('')
    .replace(/[^a-z0-9]/g, '');
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
  const cappedFanBoosts = Math.min(20, fanBoosts); // Защита от накрутки: максимум 20 бустов (500 PTS) в неделю с сайта
  const founderBonus = (pantheonMeta.bonusPts && pantheonMeta.bonusPts[pKey]) ? parseInt(pantheonMeta.bonusPts[pKey], 10) : 0;

  const kdPts = Math.round(liveKd * 450); // Базовый вес скилла K/D
  const growthPts = Math.round(delta * 1200); // Огромный бонус за рост K/D за неделю!
  const matchActivityPts = (matchesPlayed * 85) + (matchesWon * 95) + (mvpCount * 160) + (totalKills * 3); // Активность в матчах
  const siteActivityPts = (cappedFanBoosts * 25) + founderBonus; // Активность на сайте (бусты с лимитом + бонус Основателя)

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

// Аппаратный отпечаток устройства (GPU + Экран + Ядра процессора) — не сбрасывается в Инкогнито или другом браузере!
function getHardwareSignatureHash() {
  try {
    let glRenderer = 'nogl';
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) glRenderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'webgl';
    }
    const raw = [
      screen.width,
      screen.height,
      screen.colorDepth,
      Math.round((window.devicePixelRatio || 1) * 100),
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0,
      Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      glRenderer
    ].join('|');
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 'HW-' + (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
  } catch (e) {
    return 'HW-FALLBACK';
  }
}

// Подписка на данные Пантеона (бусты активности на сайте, бонусы Основателя и серверные замки анти-накрутки)
onSnapshot(doc(db, DB_COLLECTION, "pantheon"), (snap) => {
  if (snap.exists()) {
    pantheonMeta = {
      boosts: snap.data().boosts || {},
      bonusPts: snap.data().bonusPts || {},
      boostLocks: snap.data().boostLocks || {}
    };
  } else {
    pantheonMeta = { boosts: {}, bonusPts: {}, boostLocks: {} };
  }
  renderPantheonSection();
});

// Защищенная функция «🔥 БУСТ БОЙЦА (+25 PTS)» (C6E Shield Anti-Multi-Device & Anti-Incognito Lock)
let isBoostInProgress = false;
window.boostPantheonPlayer = async (nick) => {
  if (checkIfCurrentUserBanned()) return;
  if (isBoostInProgress) return;
  const pKey = normalizeNickKey(nick);
  if (!pKey) return;

  isBoostInProgress = true;
  try {
    await resolveClientIp();
    const hwHash = getHardwareSignatureHash();
    const cleanIpKey = (clientSecurityMeta.ip && clientSecurityMeta.ip !== 'Определяется...' && clientSecurityMeta.ip !== 'Скрыт / VPN')
      ? 'ip_' + clientSecurityMeta.ip.replace(/[^a-zA-Z0-9]/g, '_')
      : null;

    // 1. Защита от VPN / Скрытого IP при голосовании
    if (!cleanIpKey) {
      await logSecurityEvent('🚨 ТРЕВОГА: Буст со скрытым IP/VPN', nick, `Попытка накрутки буста без IP (${hwHash})`);
      window.showNotify("🛡 C6E Shield: Отключите VPN/прокси для честного голосования в Пантеоне!", "error");
      return;
    }

    const ref = doc(db, DB_COLLECTION, "pantheon");
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    let boosts = data.boosts ? { ...data.boosts } : {};
    let boostLocks = data.boostLocks ? { ...data.boostLocks } : {};

    // Лимит 20 бустов (500 PTS) в неделю на одного бойца
    if ((parseInt(boosts[pKey], 10) || 0) >= 20) {
      window.showNotify(`Боец ${nick} уже набрал максимум 20/20 бустов (500 PTS) на этой неделе! Теперь решают только матчи в Табе.`, "error");
      return;
    }

    const nowMs = Date.now();
    const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 часов серверной блокировки по IP (Wi-Fi сети), железу (HW) и Device ID

    const lockKeys = [
      cleanIpKey,                       // Блокирует ВСЕ вторые телефоны/ПК в том же доме/Wi-Fi/точке доступа!
      `hw_${hwHash}`,                   // Блокирует Инкогнито и другие браузеры на том же телефоне!
      `dev_${clientSecurityMeta.deviceId}`      // Блокирует по ID устройства
    ];

    // Проверяем и локальный, и серверный замок в Firebase
    const localCoolKey = `c6e_boost_global_lock`;
    let blockedReason = null;
    let remainingMins = 0;

    if (!checkCooldown(localCoolKey, 720)) {
      blockedReason = 'Локальный таймер браузера';
      remainingMins = 720;
    } else {
      for (const lk of lockKeys) {
        const lastTs = parseInt(boostLocks[lk], 10) || 0;
        if (nowMs - lastTs < COOLDOWN_MS) {
          remainingMins = Math.ceil((COOLDOWN_MS - (nowMs - lastTs)) / 60000);
          blockedReason = lk.startsWith('ip_')
            ? 'С вашей интернет-сети (IP / Wi-Fi) уже голосовали со второго устройства'
            : 'С этого устройства (даже через Инкогнито) уже был дан буст';
          break;
        }
      }
    }

    if (blockedReason) {
      const hrs = Math.floor(remainingMins / 60);
      const mins = remainingMins % 60;
      await logSecurityEvent('🚨 ТРЕВОГА: Попытка мульти-буста', nick, `${blockedReason} | HW: ${hwHash}`);
      window.showNotify(`🛡 C6E Shield: Мульти-аккаунт/второе устройство перехвачено! Буст с вашей сети будет доступен через ${hrs}ч ${mins}м.`, "error");
      return;
    }

    // Записываем буст и ставим серверный замок на IP, HW-отпечаток и Device ID
    boosts[pKey] = (parseInt(boosts[pKey], 10) || 0) + 1;
    lockKeys.forEach(lk => { boostLocks[lk] = nowMs; });

    await setDoc(ref, { boosts, boostLocks }, { merge: true });
    setCooldown(localCoolKey);
    await logSecurityEvent('🔥 Буст Пантеона (+25 PTS)', nick, `Честный буст бойцу ${nick} | HW: ${hwHash}`);
    window.showNotify(`🔥 Вы дали +25 PTS бойцу ${nick}! (Защита C6E Shield: 1 буст в 12ч с одной сети/устройства)`, "success");
  } catch (e) {
    window.showNotify("Ошибка начисления буста", "error");
  } finally {
    isBoostInProgress = false;
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
  id: 1794700000600,
  versionId: "c6e_release_v0_6_0_solar_app",
  versionLabel: "v0.6.0 // SOLAR GOLD APP & PRO TOOLS",
  date: "14.11.2026",
  tag: "ОБНОВЛЕНИЕ",
  author: "Kas (@kas_0ff)",
  tgSummary: "🚀 <b>ОБНОВЛЕНИЕ САЙТА CYBER 6 ESPORTS [v0.6.0]</b>\n\n" +
             "👨‍💻 <b>Разработчик:</b> Kas (@kas_0ff)\n\n" +
             "✨ <b>Что нового на портале:</b>\n" +
             "• 🟡 <b>Стиль Obsidian & Solar Gold:</b> новый дизайн приложения с золотыми ореолами и нижней док-панелью вместо старого меню.\n" +
             "• 🔥 <b>Focus Streak и Уровни (LEVEL):</b> ежедневный чек-ин на сайте (+15 ⚡) и прокачка уровня профиля.\n" +
             "• 🗺 <b>Тактическая база карт и Pick'Em:</b> разбор карт от [C6E], голосование за исход матчей и копирование настроек бойцов в 1 тап.\n" +
             "• 🏅 <b>Медали профиля и быстрые реакции:</b> золотые значки достижений и реакции (🔥 👑 ❤️ ⚡) под новостями и Табами.\n" +
             "• ⚡ <b>Скорость 120 FPS:</b> мгновенное переключение вкладок на телефонах, планшетах, iPad и ПК!",
  title: "🚀 ОБНОВЛЕНИЕ v0.6.0 ОТ KAS: ДИЗАЙН SOLAR GOLD, ДОК-ПАНЕЛЬ, УРОВНИ ПРОФИЛЯ, БАЗА КАРТ И 120 FPS!",
  text: `
    <div style="border-radius:14px; border:1px solid rgba(245,176,65,0.45); background:linear-gradient(145deg, rgba(245,176,65,0.14) 0%, rgba(10,11,15,0.98) 100%); padding:14px 16px; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="logo.png" alt="C6E" onerror="this.style.display='none'" style="width:48px; height:48px; border-radius:50%; border:1.5px solid #f5b041; padding:4px; background:#07080b;">
        <div>
          <div style="font-family:'Orbitron',sans-serif; font-size:9px; color:#f5b041; font-weight:900; letter-spacing:1px;">⚡ ПАТЧ v0.6.0 • DEV: KAS (@kas_0ff)</div>
          <div style="font-family:'Orbitron',sans-serif; font-size:14px; font-weight:900; color:#fff; margin-top:2px;">OBSIDIAN & SOLAR GOLD APP EDITION</div>
        </div>
      </div>
    </div>

    <p style="margin:0 0 10px 0; font-size:12.5px; color:#e4e4e2; line-height:1.55;">
      Салам всем! На связи <strong>Kas (<code>@kas_0ff</code>)</strong>. Сайт <strong>CYBER 6 ESPORTS <code>[C6E]</code></strong> переведён на новый движок <code>v0.6.0</code> в стиле мобильного кибер-приложения:
    </p>

    <div style="display:flex; flex-direction:column; gap:7px; margin-bottom:12px; font-size:12px; color:#d4d0c8;">
      <div style="padding:9px 12px; border-radius:10px; background:rgba(255,255,255,0.03); border-left:3px solid #f5b041;">
        🟡 <strong>Дизайн Solar Gold & Док-панель:</strong> золотые кольца-ореолы, круговой дашборд <code>WIN RATE</code> и нижняя панель иконок вместо старого гамбургера.
      </div>
      <div style="padding:9px 12px; border-radius:10px; background:rgba(255,255,255,0.03); border-left:3px solid #f5b041;">
        🔥 <strong>Focus Streak & LEVEL профиля:</strong> нажимай «Отметиться» каждый день, копи серию дней и прокачивай <code>LEVEL</code> и золотые медали профиля.
      </div>
      <div style="padding:9px 12px; border-radius:10px; background:rgba(255,255,255,0.03); border-left:3px solid #f5b041;">
        🗺️ <strong>База карт, Pick'Em и Конфиги:</strong> тактический разбор карт от <code>[C6E]</code>, прогнозы на матчи, копирование сенсы/прицела бойцов в 1 клик и реакции <code>🔥 👑 ❤️ ⚡</code>.
      </div>
      <div style="padding:9px 12px; border-radius:10px; background:rgba(255,255,255,0.03); border-left:3px solid #f5b041;">
        ⚡ <strong>Оптимизация 120 FPS:</strong> мгновенное открытие вкладок без задержек на телефонах, iPad, планшетах и ПК.
      </div>
    </div>
  `
};

let currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
let cachedFirestoreNewsList = [];

function getMergedNewsFeedList() {
  const list = Array.isArray(cachedFirestoreNewsList) ? [...cachedFirestoreNewsList] : [];

  // 1. Всегда гарантируем, что встроенный актуальный релиз кода (DEFAULT_KAS_RELEASE v0.5.0) есть в ленте новостей
  const hasBuiltInRelease = list.some(n =>
    (n.versionId && n.versionId === DEFAULT_KAS_RELEASE.versionId) ||
    (n.title && DEFAULT_KAS_RELEASE.title && n.title.trim() === DEFAULT_KAS_RELEASE.title.trim())
  );
  if (!hasBuiltInRelease) {
    list.push({
      id: DEFAULT_KAS_RELEASE.id,
      versionId: DEFAULT_KAS_RELEASE.versionId,
      title: DEFAULT_KAS_RELEASE.title,
      text: DEFAULT_KAS_RELEASE.text,
      date: DEFAULT_KAS_RELEASE.date,
      tag: DEFAULT_KAS_RELEASE.tag || 'ОБНОВЛЕНИЕ'
    });
  }

  // 2. Если из админки был опубликован еще более новый релиз в site_release — добавляем и его
  if (currentActiveRelease && currentActiveRelease.versionId && currentActiveRelease.versionId !== DEFAULT_KAS_RELEASE.versionId) {
    const hasCustomRelease = list.some(n =>
      (n.versionId && n.versionId === currentActiveRelease.versionId) ||
      (n.title && currentActiveRelease.title && n.title.trim() === currentActiveRelease.title.trim())
    );
    if (!hasCustomRelease && currentActiveRelease.title) {
      list.push({
        id: currentActiveRelease.id || Date.now(),
        versionId: currentActiveRelease.versionId,
        title: currentActiveRelease.title,
        text: currentActiveRelease.text,
        date: currentActiveRelease.date || new Date().toLocaleDateString('ru-RU'),
        tag: currentActiveRelease.tag || 'ОБНОВЛЕНИЕ'
      });
    }
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
            ${typeof window.renderPostReactionsHTML === 'function' ? window.renderPostReactionsHTML('news_' + (n.versionId || n.id || '0')) : ''}
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

  modal.innerHTML = `
    <div class="c6e-release-box" style="width:min(95vw, 550px); max-height:82vh; display:flex; flex-direction:column; overflow:hidden; background:linear-gradient(165deg, #14161f 0%, #090a0e 100%); border:1.5px solid rgba(245,176,65,0.55); border-radius:20px; box-shadow:0 25px 70px rgba(0,0,0,0.96);">
      <div class="c6e-release-top" style="flex-shrink:0; padding:12px 15px; background:rgba(18,20,28,0.98); border-bottom:1px solid rgba(245,176,65,0.22); display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; min-width:0;">
          <span style="background:rgba(245,176,65,0.18); border:1px solid #f5b041; color:#f5b041; font-family:var(--font-tech); font-size:8.5px; font-weight:900; padding:4px 9px; border-radius:20px; letter-spacing:1px;">
            ⚡ ПАТЧ-НОУТ [C6E]
          </span>
          <span style="font-family:var(--font-tech); font-size:9.5px; color:var(--silver); font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHTML(rel.versionLabel || 'v0.5.0')}
          </span>
        </div>
        <button type="button" onclick="window.closeSiteReleaseModal(true)" style="flex-shrink:0; min-width:88px; height:34px; border-radius:18px; background:rgba(245,176,65,0.18); border:1px solid #f5b041; color:#f5b041; font-family:var(--font-tech); font-size:9.5px; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:5px; padding:0 12px;">
          ЗАКРЫТЬ ✕
        </button>
      </div>

      <div class="c6e-release-body" style="flex:1 1 auto; min-height:0; max-height:calc(82vh - 126px); overflow-y:auto; -webkit-overflow-scrolling:touch; padding:15px;">
        <h2 style="font-family:var(--font-tech); font-size:clamp(14px, 3.8vw, 18px); color:#fff; margin:0 0 12px 0; line-height:1.35;">
          ${escapeHTML(rel.title)}
        </h2>
        <div style="font-size:12.5px; color:#ccc; line-height:1.6;">
          ${rel.text}
        </div>
      </div>

      <div class="c6e-release-footer" style="flex-shrink:0; padding:11px 15px; background:rgba(18,20,28,0.98); border-top:1px solid rgba(245,176,65,0.22); display:flex; gap:8px;">
        <button type="button" class="btn-glitch" style="width:100%; padding:11px 16px !important; font-size:10.5px !important; margin:0;" onclick="window.closeSiteReleaseModal(true);">
          ПОНЯТНО, ЗАКРЫТЬ ОКНО ✕
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.classList.add('active');
};

window.closeSiteReleaseModal = (markSeen = true) => {
  const modal = document.getElementById('c6e-release-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
  if (markSeen) {
    try {
      if (currentActiveRelease && currentActiveRelease.versionId) {
        localStorage.setItem('c6e_seen_release_ver', currentActiveRelease.versionId);
      }
      localStorage.setItem('c6e_seen_release_ver_v5', DEFAULT_KAS_RELEASE.versionId);
    } catch (e) {}
  }
};

let releasePopupTimer = null;
function checkAndShowReleaseNotification() {
  if (!currentActiveRelease || !currentActiveRelease.versionId) return;
  let seenVer = '';
  try {
    seenVer = localStorage.getItem('c6e_seen_release_ver') || localStorage.getItem('c6e_seen_release_ver_v5') || '';
  } catch (e) {}

  if (seenVer !== currentActiveRelease.versionId) {
    const btnNews = document.getElementById('btn-news');
    if (btnNews) btnNews.classList.add('has-update');

    // Добавляем также в колокольчик уведомлений (если еще не добавлено)
    try {
      const bellKey = 'c6e_bell_rel_' + currentActiveRelease.versionId;
      if (!localStorage.getItem(bellKey) && typeof addPersonalNotification === 'function') {
        localStorage.setItem(bellKey, '1');
        addPersonalNotification(
          `🚀 Вышло обновление ${currentActiveRelease.versionLabel || 'v0.5.0'}!`,
          currentActiveRelease.title,
          'info',
          'news'
        );
      }
    } catch (e) {}

    if (releasePopupTimer) clearTimeout(releasePopupTimer);
    releasePopupTimer = setTimeout(() => {
      if (!document.documentElement.classList.contains('c6e-gate-locked')) {
        window.openSiteReleaseModal(currentActiveRelease);
        if (window.showNotify) {
          window.showNotify("🚀 Вышло обновление сайта от Kas! Пост уже опубликован в разделе «Новости».", "success");
        }
      }
    }, 1100);
  }
}

// Сразу рендерим ленту новостей со встроенным постом v0.5.0 без ожидания ответа сети
renderPublicNewsFeeds();

// АВТОМАТИЧЕСКАЯ СИНХРОНИЗАЦИЯ НОВОГО РЕЛИЗА ИЗ ФАЙЛОВ В НОВОСТИ САЙТА И В TELEGRAM-КАНАЛ [C6E]
let autoReleaseBroadcastChecked = false;
async function autoSyncAndBroadcastNewFileRelease() {
  if (autoReleaseBroadcastChecked) return;
  autoReleaseBroadcastChecked = true;
  try {
    const relVer = DEFAULT_KAS_RELEASE.versionId;
    const localSentKey = 'c6e_tg_autobroadcast_' + relVer;

    // 1. Проверяем в облаке (reviews / site_release), отправлялся ли уже этот релиз файлов в ТГК
    const revRef = doc(db, DB_COLLECTION, "reviews");
    const revSnap = await getDoc(revRef);
    const alreadyBroadcastedInCloud = revSnap.exists() && revSnap.data().c6e_last_tg_rel === relVer;

    // 2. Автоматически сохраняем пост обновления в siteData/news и siteData/site_release (если доступно)
    try {
      const newsRef = doc(db, DB_COLLECTION, "news");
      const newsSnap = await getDoc(newsRef);
      let newsList = (newsSnap.exists() && Array.isArray(newsSnap.data().list)) ? [...newsSnap.data().list] : [];
      if (!newsList.some(n => n.versionId === relVer)) {
        newsList.push({
          id: DEFAULT_KAS_RELEASE.id,
          versionId: relVer,
          date: DEFAULT_KAS_RELEASE.date,
          tag: "ОБНОВЛЕНИЕ",
          title: DEFAULT_KAS_RELEASE.title,
          text: DEFAULT_KAS_RELEASE.text
        });
        await setDoc(newsRef, { list: newsList }, { merge: true });
      }
      await setDoc(doc(db, DB_COLLECTION, "site_release"), {
        ...DEFAULT_KAS_RELEASE,
        tgBroadcastedVersion: relVer
      }, { merge: true });
    } catch (eNews) {}

    // 3. Если этот релиз файлов ещё НЕ отправлялся в ТГК — ждём подгрузки токена бота и автоматически публикуем в ТГК!
    if (!alreadyBroadcastedInCloud && !localStorage.getItem(localSentKey)) {
      localStorage.setItem(localSentKey, '1');
      try {
        await updateDoc(revRef, { c6e_last_tg_rel: relVer });
      } catch (eLock) {}

      setTimeout(async () => {
        if (!TG_CONFIG.token) {
          try {
            const bSnap = await getDoc(doc(db, DB_COLLECTION, "bot_config"));
            if (bSnap.exists() && bSnap.data().encToken) {
              TG_CONFIG.token = decodeBotToken(bSnap.data().encToken);
            }
          } catch (eBot) {}
        }
        if (TG_CONFIG.token && DEFAULT_KAS_RELEASE.tgSummary) {
          const tgText = DEFAULT_KAS_RELEASE.tgSummary + `\n\n🌐 <b>Оценить обновление на сайте:</b>\nhttps://cyber6esports.github.io/`;
          await sendToBot(TG_CONFIG.channelId, tgText);
        }
      }, 2200);
    }
  } catch (e) {}
}

onSnapshot(doc(db, DB_COLLECTION, "site_release"), (snap) => {
  if (snap.exists() && snap.data().versionId && snap.data().title) {
    const remoteRel = snap.data();
    const isOlder = (remoteRel.id || 0) <= (DEFAULT_KAS_RELEASE.id || 0);
    if (!isOlder) {
      currentActiveRelease = { ...DEFAULT_KAS_RELEASE, ...remoteRel };
    } else {
      currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
    }
  } else {
    currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
  }
  renderPublicNewsFeeds();
  checkAndShowReleaseNotification();
  autoSyncAndBroadcastNewFileRelease();
}, () => {
  currentActiveRelease = { ...DEFAULT_KAS_RELEASE };
  renderPublicNewsFeeds();
  checkAndShowReleaseNotification();
});

onSnapshot(doc(db, DB_COLLECTION, "news"), (snap) => {
  cachedFirestoreNewsList = (snap.exists() && snap.data().list) ? snap.data().list : [];
  renderPublicNewsFeeds();
}, () => {
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
  const ringEl = document.getElementById('home-winrate-ring-circle');
  if (wrEl) wrEl.innerText = `${rate}%`;
  if (totEl) totEl.innerText = total;
  if (ringEl) {
    const circumference = 264;
    const offset = circumference - (Math.min(100, Math.max(0, rate)) / 100) * circumference;
    ringEl.style.strokeDashoffset = String(Math.round(offset));
  }

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



// ============================================================================
// 8. ЯДРО ОБНОВЛЕНИЯ v0.5.0: ТЕМЫ, ИГРОВЫЕ ПРОФИЛИ (12+), ВЕРИФИКАЦИЯ [C6E],
//    ФЛАГИ СТРАН, ОНЛАЙН-РАДАР, ОБЩИЙ ЧАТ (12Ч), УВЕДОМЛЕНИЯ И МАГАЗИН [C6E]
// ============================================================================

const THEME_PRESETS = {
  red:   { name: '🔴 Кровавый Рубин [C6E]', accent: '#9e1b28', light: '#d42638', dim: 'rgba(158, 27, 40, 0.16)', glow: 'rgba(212, 38, 56, 0.38)' },
  green: { name: '🟢 Темно-зеленый Изумруд', accent: '#0b6e4f', light: '#00c885', dim: 'rgba(11, 110, 79, 0.18)', glow: 'rgba(0, 200, 133, 0.38)' },
  gold:  { name: '🟡 Obsidian & Solar Gold (Ночной Кибер)', accent: '#b87b14', light: '#f5b041', dim: 'rgba(245, 176, 65, 0.14)', glow: 'rgba(245, 176, 65, 0.42)' },
  blue:  { name: '🔵 Темно-синий Сапфир', accent: '#1446a0', light: '#3b82f6', dim: 'rgba(20, 70, 160, 0.18)', glow: 'rgba(59, 130, 246, 0.38)' }
};

function applySiteTheme(themeKey) {
  const key = THEME_PRESETS[themeKey] ? themeKey : 'gold';
  const t = THEME_PRESETS[key];
  document.documentElement.setAttribute('data-theme', key);
  document.documentElement.style.setProperty('--accent', t.accent);
  document.documentElement.style.setProperty('--accent-light', t.light);
  document.documentElement.style.setProperty('--accent-dim', t.dim);
  document.documentElement.style.setProperty('--accent-glow', t.glow);
  try { localStorage.setItem('c6e_theme_color', key); } catch (e) {}
}

// Применяем сохраненную тему сразу при старте
try {
  const savedTheme = localStorage.getItem('c6e_theme_color') || 'gold';
  applySiteTheme(savedTheme);
} catch (e) {}

window.openThemeSwitcherModal = () => {
  let modal = document.getElementById('c6e-theme-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'c6e-theme-modal';
    modal.className = 'c6e-modal-overlay';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    document.body.appendChild(modal);
  }
  const cur = localStorage.getItem('c6e_theme_color') || 'gold';
  modal.innerHTML = `
    <div class="c6e-modal-card" style="max-width:420px;">
      <div class="c6e-modal-head">
        <span style="font-family:var(--font-tech); font-size:12px; font-weight:900; color:#fff;">
          <i class="fas fa-palette text-accent"></i> ЦВЕТ ОФОРМЛЕНИЯ САЙТА
        </span>
        <button type="button" class="c6e-modal-close" onclick="document.getElementById('c6e-theme-modal').classList.remove('active')">✕</button>
      </div>
      <div class="c6e-modal-body">
        <p style="font-size:11px; color:var(--silver-muted); margin:0 0 12px 0;">
          Выбери фирменный цветовой стиль интерфейса (текст и структура сайта остаются идеально читаемыми):
        </p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${Object.entries(THEME_PRESETS).map(([k, v]) => `
            <button type="button" onclick="window.selectSiteTheme('${k}')" style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-radius:10px; border:1px solid ${cur === k ? v.light : 'rgba(255,255,255,0.1)'}; background:${cur === k ? v.dim : 'rgba(255,255,255,0.03)'}; color:#fff; font-family:var(--font-tech); font-size:11px; font-weight:800; cursor:pointer;">
              <span>${v.name}</span>
              <span style="width:18px; height:18px; border-radius:50%; background:${v.light}; box-shadow:0 0 10px ${v.light}; display:inline-block;"></span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

window.selectSiteTheme = (themeKey) => {
  applySiteTheme(themeKey);
  const modal = document.getElementById('c6e-theme-modal');
  if (modal) modal.classList.remove('active');
  if (window.showNotify && THEME_PRESETS[themeKey]) {
    window.showNotify(`🎨 Установлена тема: ${THEME_PRESETS[themeKey].name}`, 'success');
  }
};

// АВТОМАТИЧЕСКОЕ ОПРЕДЕЛЕНИЕ ФЛАГА СТРАНЫ ПО ВВЕДЕННОМУ ТЕКСТУ
const COUNTRY_FLAG_DICT = [
  { keys: ['рф', 'росси', 'rus', 'russia', 'москв', 'спб', 'ru'], flag: '🇷🇺', label: 'Россия' },
  { keys: ['кыргыз', 'киргиз', 'бишкек', 'ош', 'kg', 'kyrgyz'], flag: '🇰🇬', label: 'Кыргызстан' },
  { keys: ['казах', 'алмат', 'астан', 'kz', 'kazakh'], flag: '🇰🇿', label: 'Казахстан' },
  { keys: ['индонез', 'indonesia', 'id', 'джакарт'], flag: '🇮🇩', label: 'Индонезия' },
  { keys: ['узбеки', 'ташкент', 'uz', 'uzbek'], flag: '🇺🇿', label: 'Узбекистан' },
  { keys: ['беларус', 'белорус', 'минск', 'by', 'belarus'], flag: '🇧🇾', label: 'Беларусь' },
  { keys: ['украин', 'киев', 'ua', 'ukrain'], flag: '🇺🇦', label: 'Украина' },
  { keys: ['таджик', 'душанбе', 'tj', 'tajik'], flag: '🇹🇯', label: 'Таджикистан' },
  { keys: ['азербай', 'баку', 'az', 'azer'], flag: '🇦🇿', label: 'Азербайджан' },
  { keys: ['армени', 'ереван', 'am', 'armen'], flag: '🇦🇲', label: 'Армения' },
  { keys: ['грузи', 'тбилис', 'ge', 'georgia'], flag: '🇬🇪', label: 'Грузия' },
  { keys: ['турци', 'стамбул', 'tr', 'turkey'], flag: '🇹🇷', label: 'Турция' },
  { keys: ['сша', 'америк', 'usa', 'us'], flag: '🇺🇸', label: 'США' },
  { keys: ['герман', 'берлин', 'de', 'german'], flag: '🇩🇪', label: 'Германия' },
  { keys: ['польш', 'варшав', 'pl', 'poland'], flag: '🇵🇱', label: 'Польша' },
  { keys: ['бразил', 'br', 'brazil'], flag: '🇧🇷', label: 'Бразилия' },
  { keys: ['япони', 'токио', 'jp', 'japan'], flag: '🇯🇵', label: 'Япония' },
  { keys: ['коре', 'сеул', 'kr', 'korea'], flag: '🇰🇷', label: 'Южная Корея' },
  { keys: ['китай', 'пекин', 'cn', 'china'], flag: '🇨🇳', label: 'Китай' },
  { keys: ['инди', 'дели', 'in', 'india'], flag: '🇮🇳', label: 'Индия' },
  { keys: ['великобрит', 'англи', 'лондон', 'uk', 'gb'], flag: '🇬🇧', label: 'Великобритания' },
  { keys: ['франц', 'париж', 'fr', 'france'], flag: '🇫🇷', label: 'Франция' }
];

function resolveCountryInfo(rawInput) {
  const s = String(rawInput || '').trim();
  if (!s) return { flag: '🌍', label: 'Международный' };
  const low = s.toLowerCase();
  for (const item of COUNTRY_FLAG_DICT) {
    if (item.keys.some(k => low === k || (k.length >= 3 && low.includes(k)))) {
      return { flag: item.flag, label: item.label };
    }
  }
  return { flag: '🌍', label: s };
}

// Сжатие фото с телефона пользователя для Аватарки (240x240) или Баннера (720x260)
function compressUserImageFile(file, maxW = 260, maxH = 260, quality = 0.80) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = Math.max(40, Math.round(w * ratio));
        h = Math.max(40, Math.round(h * ratio));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Глобальное состояние профилей, уведомлений, чата и магазина
let allProfilesList = [];
let myLocalProfile = null;
let myUserNotifications = [];
let globalChatMessages = [];
let globalChatLastPurge = Date.now();
let currentHomeCommFilter = 'all';
let shopConfigData = {
  title: 'КИБЕР-МАРКЕТ CYBER 6 ESPORTS [C6E]',
  subtitle: 'ЗАКРЫТЫЙ АУКЦИОН И ЭКСКЛЮЗИВНЫЙ ИГРОВОЙ КОНТЕНТ',
  hypeText: 'Основатель и разработчик Kas готовит к запуску закрытый магазин [C6E]! Здесь появятся проверенные паки Голды, приватные конфигурации прицела и сенсы от топ-бойцов нашего состава, редкие VIP-рамки для профиля на сайте и пропуски на закрытые турниры с денежным фондом.',
  waitlist: []
};
const sessionBootTime = Date.now();

// УПРАВЛЕНИЕ БЛОКИРОВКОЙ ЭКРАНА ДО СОЗДАНИЯ ПРОФИЛЯ (БЕЗ ПРОКРУТКИ И ПРОСВЕЧИВАНИЯ САЙТА)
function setGateLockState(locked) {
  if (locked) {
    document.documentElement.classList.add('c6e-gate-locked');
    document.body?.classList.add('c6e-gate-locked');
  } else {
    document.documentElement.classList.remove('c6e-gate-locked');
    document.body?.classList.remove('c6e-gate-locked');
  }
}

function loadLocalProfileCache() {
  try {
    const raw = localStorage.getItem('c6e_user_profile_v5');
    if (raw) {
      myLocalProfile = JSON.parse(raw);
      if (myLocalProfile && myLocalProfile.clanTag) {
        myLocalProfile.clanTag = String(myLocalProfile.clanTag).replace(/[\[\]\?]/g, '').trim();
      }
    }
  } catch (e) {}
  try {
    const rawN = localStorage.getItem('c6e_user_notifs_v5');
    if (rawN) myUserNotifications = JSON.parse(rawN);
  } catch (e) {}
}
loadLocalProfileCache();

function saveLocalProfileCache(prof) {
  myLocalProfile = prof;
  try {
    localStorage.setItem('c6e_user_profile_v5', JSON.stringify(prof));
  } catch (e) {}
  if (prof && prof.nick && prof.c6eStatus !== 'rejected') {
    setGateLockState(false);
  }
  updateHeaderProfileChipUI();
  autoFillFormsWithProfile();
}

// ОТПРАВКА СИСТЕМНОГО PUSH-УВЕДОМЛЕНИЯ НА ТЕЛЕФОН / ПК (С ПОДДЕРЖКОЙ ANDROID CHROME И SERVICE WORKER)
function triggerNativeDeviceNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && typeof reg.showNotification === 'function') {
          reg.showNotification(title, {
            body: body,
            icon: 'logo.png',
            badge: 'logo.png',
            vibrate: [180, 80, 180]
          });
        } else {
          new Notification(title, { body: body, icon: 'logo.png', badge: 'logo.png' });
        }
      }).catch(() => {
        try { new Notification(title, { body: body, icon: 'logo.png' }); } catch (e) {}
      });
    } else {
      new Notification(title, { body: body, icon: 'logo.png', badge: 'logo.png' });
    }
  } catch (e) {}
}

function addPersonalNotification(title, body, type = 'info', actionTab = null) {
  const item = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title,
    body,
    type,
    actionTab,
    timeStr: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    read: false
  };
  myUserNotifications.unshift(item);
  if (myUserNotifications.length > 35) myUserNotifications = myUserNotifications.slice(0, 35);
  try {
    localStorage.setItem('c6e_user_notifs_v5', JSON.stringify(myUserNotifications));
  } catch (e) {}
  updateNotifBellBadgeUI();
  triggerNativeDeviceNotification(title, body);
}

function updateNotifBellBadgeUI() {
  const badge = document.getElementById('notif-badge-count');
  if (badge) {
    const unread = myUserNotifications.filter(n => !n.read).length;
    if (unread > 0) {
      badge.style.display = 'inline-flex';
      badge.innerText = unread > 9 ? '9+' : String(unread);
    } else {
      badge.style.display = 'none';
    }
  }
  const homePushBar = document.getElementById('home-push-optin-bar');
  if (homePushBar) {
    if ('Notification' in window && Notification.permission !== 'granted') {
      homePushBar.style.display = 'flex';
    } else {
      homePushBar.style.display = 'none';
    }
  }
}
updateNotifBellBadgeUI();

// СИНХРОННЫЙ ЗАПРОС РАЗРЕШЕНИЯ НА PUSH-УВЕДОМЛЕНИЯ ПО КЛИКУ ПОЛЬЗОВАТЕЛЯ
window.requestDevicePushPermission = () => {
  if (!('Notification' in window)) {
    window.showNotify("Ваш браузер не поддерживает системные push-уведомления, но колокольчик 🔔 в шапке сайта активен!", "error");
    return Promise.resolve('unsupported');
  }
  if (Notification.permission === 'granted') {
    updateNotifBellBadgeUI();
    triggerNativeDeviceNotification("🔔 CYBER 6 ESPORTS [C6E]", "Системные уведомления на ваше устройство уже активны!");
    window.showNotify("📲 Push-уведомления на устройство уже включены!", "success");
    return Promise.resolve('granted');
  }
  try {
    // Вызывается строго синхронно внутри пользовательского клика (требование Android Chrome / iOS Safari)
    const reqResult = Notification.requestPermission((permLegacy) => {
      handlePushPermissionOutcome(permLegacy);
    });
    if (reqResult && typeof reqResult.then === 'function') {
      return reqResult.then((perm) => {
        handlePushPermissionOutcome(perm);
        return perm;
      }).catch(() => 'default');
    }
  } catch (e) {}
  return Promise.resolve('default');
};

function handlePushPermissionOutcome(perm) {
  updateNotifBellBadgeUI();
  if (perm === 'granted') {
    window.showNotify("📲 Уведомления на ваше устройство успешно включены!", "success");
    addPersonalNotification(
      "🔔 Уведомления CYBER 6 ESPORTS активны!",
      "Теперь вы будете получать оповещения на устройство об обновлениях от Kas, @упоминаниях в чате и лайках профиля.",
      "success"
    );
    if (document.getElementById('c6e-notif-modal')?.classList.contains('active')) {
      window.openNotificationsModal();
    }
  } else if (perm === 'denied') {
    window.showNotify("Системные уведомления отключены в браузере. Все события будут приходить в колокольчик 🔔 в шапке сайта!", "error");
  }
}

window.openNotificationsModal = () => {
  let modal = document.getElementById('c6e-notif-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'c6e-notif-modal';
    modal.className = 'c6e-modal-overlay';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    document.body.appendChild(modal);
  }

  myUserNotifications.forEach(n => { n.read = true; });
  try { localStorage.setItem('c6e_user_notifs_v5', JSON.stringify(myUserNotifications)); } catch (e) {}
  updateNotifBellBadgeUI();

  const permStatus = ('Notification' in window) ? Notification.permission : 'unsupported';

  modal.innerHTML = `
    <div class="c6e-modal-card" style="max-width:500px;">
      <div class="c6e-modal-head">
        <span style="font-family:var(--font-tech); font-size:12px; font-weight:900; color:#fff;">
          <i class="fas fa-bell text-accent"></i> ЦЕНТР УВЕДОМЛЕНИЙ [C6E]
        </span>
        <button type="button" class="c6e-modal-close" onclick="document.getElementById('c6e-notif-modal').classList.remove('active')">✕</button>
      </div>
      <div class="c6e-modal-body">
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); border-radius:10px; padding:10px 12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="font-size:11px; color:var(--silver);">
            📲 <b>Push-уведомления на телефон/ПК:</b>
            <span style="color:${permStatus === 'granted' ? 'var(--success)' : '#ffb300'}; font-weight:700;">
              ${permStatus === 'granted' ? 'ВКЛЮЧЕНЫ ✅' : 'НЕ ВКЛЮЧЕНЫ'}
            </span>
          </div>
          ${permStatus !== 'granted' ? `
            <button type="button" class="chip-btn" style="background:var(--success); border-color:var(--success); color:#000; font-weight:800;" onclick="window.requestDevicePushPermission()">
              🔔 Разрешить отправку
            </button>
          ` : ''}
        </div>

        <div style="display:flex; flex-direction:column; gap:8px; max-height:52vh; overflow-y:auto;">
          ${myUserNotifications.length === 0 ? `
            <div style="text-align:center; padding:25px; font-size:12px; color:var(--silver-muted);">
              Пока нет новых уведомлений. Когда вас упомянут через <b>@Ник</b> в чате или поставят ❤️ лайк вашему профилю, они появятся здесь!
            </div>
          ` : myUserNotifications.map(n => `
            <div style="padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.03); border-left:3px solid ${n.type === 'mention' ? '#ffb300' : (n.type === 'error' ? '#ff5263' : 'var(--success)')};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <b style="font-size:11.5px; color:#fff;">${escapeHTML(n.title)}</b>
                <span style="font-size:9px; color:var(--silver-muted);">${escapeHTML(n.timeStr)}</span>
              </div>
              <div style="font-size:11.5px; color:#ccc; line-height:1.45;">${escapeHTML(n.body)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
};


// ПРЕСЕТЫ КИБЕР-АВАТАРОК [C6E] (ДЛЯ ВЫБОРА В 1 КЛИК В ПРОФИЛЕ)
const C6E_AVATAR_PRESETS = [
  { name: 'Логотип [C6E]', url: 'logo.png' },
  { name: 'Кибер-Самурай', url: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#222530"/><stop offset="100%" stop-color="#090a0f"/></linearGradient></defs><rect width="120" height="120" fill="url(#g1)"/><polygon points="60,14 102,38 102,82 60,106 18,82 18,38" fill="none" stroke="#d42638" stroke-width="4"/><path d="M38 52 L54 60 L38 68 Z M82 52 L66 60 L82 68 Z" fill="#e4e4e2"/><path d="M44 80 Q60 90 76 80" stroke="#d42638" stroke-width="4" fill="none"/></svg>')}` },
  { name: 'Фантом Хром', url: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#0d0e13"/><circle cx="60" cy="60" r="44" fill="none" stroke="#e4e4e2" stroke-width="3" stroke-dasharray="10 5"/><polygon points="60,24 90,78 30,78" fill="rgba(228,228,226,0.12)" stroke="#ffffff" stroke-width="3"/><circle cx="60" cy="58" r="10" fill="#d42638"/></svg>')}` },
  { name: 'Снайпер AWM', url: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#0b0c10"/><circle cx="60" cy="60" r="40" fill="none" stroke="#e4e4e2" stroke-width="3"/><line x1="60" y1="10" x2="60" y2="110" stroke="#d42638" stroke-width="2.5"/><line x1="10" y1="60" x2="110" y2="60" stroke="#d42638" stroke-width="2.5"/><circle cx="60" cy="60" r="16" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="60" cy="60" r="4" fill="#d42638"/></svg>')}` },
  { name: 'Корона Пантеона', url: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#101117"/><polygon points="24,84 32,42 50,62 60,32 70,62 88,42 96,84" fill="rgba(228,228,226,0.16)" stroke="#e4e4e2" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="88" width="68" height="7" rx="3" fill="#d42638"/></svg>')}` }
];

// ПРОВЕРКА НАЛИЧИЯ ГАЛОЧКИ РАЗРАБОТЧИКА У ПРОФИЛЯ ИГРОКА (ВЫДАЕТСЯ В АДМИНКЕ + АВТОМАТИЧЕСКИ У KAS)
function hasDeveloperBadge(prof) {
  if (!prof) return false;
  if (prof.isDeveloper === true || prof.devBadge === true || prof.role === 'developer') return true;
  const cleanN = String(prof.nick || '').trim().toLowerCase();
  if ((cleanN === 'kas' || cleanN === 'kas_0ff' || cleanN === '@kas_0ff') && (prof.c6eStatus === 'approved' || prof.claimsC6E)) {
    return true;
  }
  return false;
}

function renderDevVerifiedCheckHTML(prof) {
  if (!hasDeveloperBadge(prof)) return '';
  return `<span class="c6e-dev-verified-badge" title="Официальный Разработчик CYBER 6 ESPORTS">✓</span>`;
}

function getDisplayTagAndBadge(prof) {
  if (!prof) return { tagStr: '', badgeHtml: 'Гость портала', isApprovedC6E: false, isDev: false };
  const isDev = hasDeveloperBadge(prof);
  const devPill = isDev ? `<span class="c6e-dev-pill-tag"><span class="c6e-dev-verified-badge" style="width:12px;height:12px;font-size:7px;">✓</span> DEV [C6E]</span> ` : '';

  if (prof.c6eStatus === 'approved' || isDev) {
    return {
      tagStr: '[C6E]',
      badgeHtml: `${devPill}<span style="color:var(--silver); font-weight:800;">🛡️ Боец [C6E]</span>`,
      isApprovedC6E: true,
      isDev
    };
  }
  if (prof.c6eStatus === 'pending') {
    return {
      tagStr: '[C6E]',
      badgeHtml: `${devPill}<span style="color:var(--silver-muted); font-weight:700;">⏳ На проверке в [C6E]</span>`,
      isApprovedC6E: false,
      isDev
    };
  }
  const cleanTag = (prof.clanTag || '').replace(/[\[\]\?]/g, '').trim();
  return {
    tagStr: cleanTag ? `[${cleanTag}]` : '',
    badgeHtml: `${devPill}<span style="color:var(--silver-muted); font-weight:700;">💎 Гость ${prof.clanName ? '• ' + escapeHTML(prof.clanName) : 'портала'}</span>`,
    isApprovedC6E: false,
    isDev
  };
}

function updateHeaderProfileChipUI() {
  const imgEl = document.getElementById('hp-avatar-img');
  const wrapEl = document.querySelector('#header-profile-chip .hp-avatar-wrap');
  const nickEl = document.getElementById('hp-nick-line');
  const subEl = document.getElementById('hp-sub-line');
  if (!nickEl || !subEl) return;

  if (!myLocalProfile || !myLocalProfile.nick) {
    nickEl.innerText = 'Создать профиль';
    subEl.innerHTML = '💎 Гость портала';
    return;
  }

  const info = getDisplayTagAndBadge(myLocalProfile);
  if (imgEl) imgEl.src = myLocalProfile.avatar || 'logo.png';
  if (wrapEl) {
    wrapEl.className = `hp-avatar-wrap ${myLocalProfile.frameStyle || 'frame-c6e-mirror'}`;
  }
  nickEl.innerHTML = `<span>${escapeHTML(myLocalProfile.countryFlag || '🌍')} ${info.tagStr ? escapeHTML(info.tagStr) + ' ' : ''}${escapeHTML(myLocalProfile.nick)}</span> ${renderDevVerifiedCheckHTML(myLocalProfile)}`;
  subEl.innerHTML = `${info.isDev ? '⚡ Разработчик' : (info.isApprovedC6E ? '🛡️ Боец [C6E]' : '💎 Гость')} • ❤️ ${myLocalProfile.likes || 0}`;
  if (typeof window.refreshAppHubProfile === 'function') window.refreshAppHubProfile();
}

window.refreshAppHubProfile = () => {
  const avEl = document.getElementById('hub-profile-avatar');
  const nickEl = document.getElementById('hub-profile-nick');
  const subEl = document.getElementById('hub-profile-sub');
  const badgeEl = document.getElementById('hub-profile-badge-pill');
  const kdEl = document.getElementById('hub-stat-kd');
  const likesEl = document.getElementById('hub-stat-likes');
  const ptsEl = document.getElementById('hub-stat-pts');
  if (!nickEl) return;

  if (!myLocalProfile || !myLocalProfile.nick) {
    if (avEl) avEl.src = 'logo.png';
    nickEl.innerHTML = 'ГОСТЬ ПОРТАЛА';
    if (subEl) subEl.innerText = 'FOCUS • DISCIPLINE • VICTORY';
    if (badgeEl) badgeEl.innerHTML = '💎 СОЗДАТЬ ПРОФИЛЬ';
    return;
  }

  const info = getDisplayTagAndBadge(myLocalProfile);
  if (avEl) avEl.src = myLocalProfile.avatar || 'logo.png';
  nickEl.innerHTML = `<span>${escapeHTML(myLocalProfile.countryFlag || '🌍')} ${info.tagStr ? escapeHTML(info.tagStr) + ' ' : ''}${escapeHTML(myLocalProfile.nick)}</span> ${renderDevVerifiedCheckHTML(myLocalProfile)}`;
  if (subEl) {
    subEl.innerText = `${myLocalProfile.countryText || 'Россия'} • ID: ${myLocalProfile.gameId || '—'} • ${myLocalProfile.age || 16} ЛЕТ`;
  }
  if (badgeEl) {
    badgeEl.innerHTML = info.isDev
      ? '⚡ OFFICIAL DEVELOPER [C6E]'
      : (info.isApprovedC6E ? '🛡️ ОФИЦИАЛЬНЫЙ БОЕЦ [C6E]' : (myLocalProfile.c6eStatus === 'pending' ? '⏳ ЗАЯВКА В [C6E] НА ПРОВЕРКЕ' : `💎 ГОСТЬ • ${escapeHTML(myLocalProfile.clanName || 'ПОРТАЛА')}`));
  }
  if (kdEl) kdEl.innerText = myLocalProfile.kd || '1.20';
  if (likesEl) likesEl.innerText = String(myLocalProfile.likes || 0);
  if (ptsEl) ptsEl.innerText = String(myLocalProfile.activityPts || 20);
};

// АВТО-ПОДСТАНОВКА ДАННЫХ ПРОФИЛЯ ВО ВСЕ ФОРМЫ САЙТА (ПРАКИ, ОТЗЫВЫ, ЗАЯВКА В КЛАН)
function autoFillFormsWithProfile() {
  if (!myLocalProfile || !myLocalProfile.nick) return;
  const info = getDisplayTagAndBadge(myLocalProfile);
  const fullDisplayNick = `${info.tagStr ? info.tagStr + ' ' : ''}${myLocalProfile.nick}`.trim();

  const pcClan = document.getElementById('pc-clan');
  const pcCap  = document.getElementById('pc-cap');
  const pcId   = document.getElementById('pc-id');
  if (pcClan && !pcClan.value) {
    pcClan.value = myLocalProfile.clanName || (info.tagStr ? info.tagStr : myLocalProfile.nick + ' Team');
  }
  if (pcCap && !pcCap.value) pcCap.value = fullDisplayNick;
  if (pcId && !pcId.value && myLocalProfile.gameId) pcId.value = String(myLocalProfile.gameId).replace(/\D/g, '');

  const revNick = document.getElementById('rev-nick');
  if (revNick && !revNick.value) revNick.value = fullDisplayNick;

  const joinNick = document.getElementById('nick');
  if (joinNick && !joinNick.value) joinNick.value = fullDisplayNick;
}

// ОБЯЗАТЕЛЬНОЕ ОКНО РЕГИСТРАЦИИ / РЕДАКТИРОВАНИЯ ИГРОВОГО ПРОФИЛЯ ГОСТЯ (12+)
let tempProfileAvatarDataUrl = '';
let tempProfileBannerDataUrl = '';

document.getElementById('guestAvatarFileInput')?.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    tempProfileAvatarDataUrl = await compressUserImageFile(file, 160, 160, 0.76);
    const inp = document.getElementById('prof-avatar-url-inp');
    const prev = document.getElementById('prof-avatar-preview-img');
    if (inp) {
      inp.value = '';
      inp.placeholder = '✅ Аватарка с телефона загружена!';
    }
    if (prev) prev.src = tempProfileAvatarDataUrl;
    window.showNotify("Аватарка с устройства загружена!", "success");
  } catch (err) {
    window.showNotify("Не удалось обработать фото", "error");
  }
  e.target.value = '';
});

document.getElementById('guestBannerFileInput')?.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    tempProfileBannerDataUrl = await compressUserImageFile(file, 720, 260, 0.80);
    const inp = document.getElementById('prof-banner-custom-inp');
    if (inp) inp.value = tempProfileBannerDataUrl;
    const sel = document.getElementById('prof-banner-preset-sel');
    if (sel) sel.value = 'custom';
    window.updateLiveBannerPreview('custom');
    window.showNotify("Баннер профиля с устройства загружен!", "success");
  } catch (err) {
    window.showNotify("Не удалось обработать баннер", "error");
  }
  e.target.value = '';
});

function showProfileFormStatus(msg, isError = true) {
  const box = document.getElementById('prof-form-status-msg');
  if (box) {
    box.style.display = 'block';
    box.style.background = isError ? 'rgba(212, 38, 56, 0.18)' : 'rgba(0, 230, 118, 0.14)';
    box.style.borderColor = isError ? '#ff5263' : 'var(--success)';
    box.style.color = isError ? '#ff8a96' : '#00e676';
    box.innerHTML = msg;
  }
  if (window.showNotify) {
    window.showNotify(msg.replace(/<[^>]*>/g, ''), isError ? 'error' : 'success');
  }
}

window.selectPresetAvatar = (idx) => {
  const item = C6E_AVATAR_PRESETS[idx];
  if (!item) return;
  tempProfileAvatarDataUrl = item.url;
  const prev = document.getElementById('prof-avatar-preview-img');
  const inp = document.getElementById('prof-avatar-url-inp');
  if (prev) prev.src = item.url;
  if (inp) {
    inp.value = item.url === 'logo.png' ? '' : item.url;
  }
  document.querySelectorAll('.avatar-preset-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
};

window.updateLiveBannerPreview = (presetVal) => {
  const box = document.getElementById('prof-live-banner-preview');
  const customRow = document.getElementById('prof-custom-banner-row');
  if (customRow) customRow.style.display = presetVal === 'custom' ? 'flex' : 'none';
  if (!box) return;
  const validPresets = ['banner-mirror','banner-crimson','banner-chrome','banner-gold','banner-emerald','banner-sapphire'];
  box.className = 'prof-banner-box ' + (validPresets.includes(presetVal) ? presetVal : 'banner-mirror');
  if (presetVal === 'custom') {
    const customUrl = document.getElementById('prof-banner-custom-inp')?.value || tempProfileBannerDataUrl || '';
    box.style.backgroundImage = customUrl ? `url('${customUrl}')` : '';
  } else {
    box.style.backgroundImage = '';
  }
};

window.openMyProfileModal = (forceRegistrationGate = false, rejectedMessage = null) => {
  if (checkIfCurrentUserBanned()) return;

  if (forceRegistrationGate) {
    setGateLockState(true);
  }

  let modal = document.getElementById('c6e-profile-gate-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'c6e-profile-gate-modal';
    modal.className = 'c6e-modal-overlay';
    document.body.appendChild(modal);
  }

  if (forceRegistrationGate) {
    modal.classList.add('gate-fullscreen');
  } else {
    modal.classList.remove('gate-fullscreen');
  }

  const p = myLocalProfile || {
    nick: '',
    gameId: '',
    claimsC6E: false,
    c6eStatus: 'guest',
    clanTag: '',
    clanName: '',
    kd: '1.20',
    age: 16,
    countryText: 'Россия',
    countryFlag: '🇷🇺',
    bio: '',
    avatar: 'logo.png',
    banner: 'banner-mirror',
    frameStyle: 'frame-c6e-mirror'
  };

  const isForceGuest = Boolean(rejectedMessage) || p.c6eStatus === 'rejected';
  const isC6ESelected = isForceGuest ? false : Boolean(p.claimsC6E || p.c6eStatus === 'approved' || p.c6eStatus === 'pending');
  const presetBanners = ['banner-mirror','banner-crimson','banner-chrome','banner-gold','banner-emerald','banner-sapphire'];
  const isCustomBanner = p.banner && !presetBanners.includes(p.banner);
  const activeBannerClass = isCustomBanner ? 'banner-mirror' : (p.banner || 'banner-mirror');
  const activeBannerStyle = isCustomBanner ? `background-image:url('${escapeHTML(p.banner)}');` : '';
  const needPushAsk = ('Notification' in window) && Notification.permission !== 'granted';

  modal.innerHTML = `
    <div class="c6e-modal-card" style="max-width:580px;">
      <div class="c6e-modal-head">
        <div>
          <span style="font-family:var(--font-tech); font-size:12px; font-weight:900; color:#fff;">
            <i class="fas fa-id-card text-accent"></i> ${forceRegistrationGate ? 'СОЗДАНИЕ ПРОФИЛЯ ПОРТАЛА [C6E]' : 'НАСТРОЙКА ПРОФИЛЯ, АВАТАРКИ И БАННЕРА'}
          </span>
          <div style="font-size:10px; color:var(--silver-muted); margin-top:2px;">
            ${forceRegistrationGate ? 'Быстрая регистрация без паролей и почты для входа на портал' : 'Живое зеркальное превью твоего профиля, рамки и баннера'}
          </div>
        </div>
        ${!forceRegistrationGate ? `<button type="button" class="c6e-modal-close" onclick="document.getElementById('c6e-profile-gate-modal').classList.remove('active')">✕</button>` : ''}
      </div>

      <div class="c6e-modal-body" style="max-height:82vh; overflow-y:auto;">
        ${rejectedMessage ? `
          <div style="background:rgba(212,38,56,0.16); border:1px solid #ff5263; border-radius:10px; padding:12px; margin-bottom:14px; font-size:11.5px; color:#fff; line-height:1.5;">
            🚫 <b>Заявка на тег [C6E] отклонена администрацией!</b><br>
            ${escapeHTML(rejectedMessage)} Укажите ниже тег и название клана Standoff 2, в котором вы состоите, чтобы получить значок <b>💎 Гостя портала</b>.
          </div>
        ` : ''}

        <!-- ЖИВОЕ ЗЕРКАЛЬНОЕ ПРЕВЬЮ БАННЕРА, РАМКИ И АВАТАРКИ -->
        <div style="border-radius:13px; overflow:hidden; border:1px solid var(--mirror-border-bright); background:rgba(10,11,15,0.95); margin-bottom:14px; box-shadow:0 12px 28px rgba(0,0,0,0.6);">
          <div id="prof-live-banner-preview" class="prof-banner-box ${activeBannerClass}" style="height:86px; ${activeBannerStyle}">
            <span style="position:absolute; top:8px; right:10px; z-index:2; font-family:var(--font-tech); font-size:8.5px; color:var(--silver); background:rgba(0,0,0,0.65); padding:3px 8px; border-radius:20px; border:1px solid rgba(255,255,255,0.15);">
              LIVE PREVIEW
            </span>
          </div>
          <div style="padding:0 14px 12px 14px; margin-top:-30px; position:relative; z-index:2; display:flex; align-items:flex-end; gap:12px; flex-wrap:wrap;">
            <div id="prof-avatar-preview-frame" class="c6e-hex-avatar ${escapeHTML(p.frameStyle || 'frame-c6e-mirror')}" style="width:66px; height:66px;">
              <img id="prof-avatar-preview-img" src="${escapeHTML(p.avatar || 'logo.png')}" onerror="this.src='logo.png'">
            </div>
            <div style="flex:1; min-width:160px;">
              <div style="font-size:10.5px; font-weight:700; color:var(--silver); margin-bottom:5px;">Выбери готовую кибер-аватарку или загрузи свою:</div>
              <div class="avatar-presets-strip">
                ${C6E_AVATAR_PRESETS.map((pr, idx) => `
                  <div class="avatar-preset-item ${p.avatar === pr.url ? 'active' : ''}" title="${pr.name}" onclick="window.selectPresetAvatar(${idx})">
                    <img src="${pr.url}" alt="${pr.name}">
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div style="padding:0 14px 12px 14px; display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="chip-btn" style="border-color:var(--mirror-border-bright); color:#fff;" onclick="document.getElementById('guestAvatarFileInput').click()">
              <i class="fas fa-camera text-accent"></i> Своё фото с устройства
            </button>
            <input type="text" id="prof-avatar-url-inp" class="form-input" value="${escapeHTML((!p.avatar || p.avatar === 'logo.png' || String(p.avatar).startsWith('data:')) ? '' : p.avatar)}" placeholder="Или вставь прямую ссылку на аватарку..." style="padding:6px 10px; font-size:11px; flex:1; min-width:150px;" oninput="if(this.value) document.getElementById('prof-avatar-preview-img').src = this.value">
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(175px, 1fr)); gap:10px; margin-bottom:12px;">
          <div>
            <label class="form-label">1. ТВОЙ НИК В STANDOFF 2 *</label>
            <input type="text" id="prof-nick-inp" class="form-input" value="${escapeHTML(p.nick || '')}" placeholder="Например: Kas" required>
          </div>
          <div>
            <label class="form-label">2. ИГРОВОЙ ID STANDOFF 2 *</label>
            <input type="text" id="prof-gameid-inp" class="form-input" value="${escapeHTML(p.gameId || '')}" placeholder="Например: 46594114" required>
          </div>
        </div>

        <!-- ВЫБОР: ВЫ ИЗ КЛАНА [C6E] ИЛИ НЕТ? -->
        <div style="background:rgba(255,255,255,0.025); border:1px solid var(--mirror-border); border-radius:11px; padding:12px; margin-bottom:12px;">
          <label class="form-label" style="margin-bottom:8px; color:var(--silver);"><i class="fas fa-shield-alt text-accent"></i> 3. ВЫ СОСТОИТЕ В НАШЕМ КЛАНЕ [C6E] CYBER 6 ESPORTS?</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <label id="lbl-c6e-no" style="display:flex; align-items:center; gap:7px; padding:10px; border-radius:9px; border:1px solid ${!isC6ESelected ? 'var(--silver)' : 'rgba(255,255,255,0.1)'}; background:${!isC6ESelected ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.4)'}; cursor:pointer; font-size:11px; font-weight:700; color:#fff;">
              <input type="radio" name="profC6ERadio" value="no" ${!isC6ESelected ? 'checked' : ''} onchange="window.toggleProfileClanFields(false)">
              💎 Нет, я Гость / Другой клан
            </label>
            <label id="lbl-c6e-yes" style="display:flex; align-items:center; gap:7px; padding:10px; border-radius:9px; border:1px solid ${isC6ESelected ? 'var(--accent-light)' : 'rgba(255,255,255,0.1)'}; background:${isC6ESelected ? 'var(--accent-dim)' : 'rgba(0,0,0,0.4)'}; cursor:pointer; font-size:11px; font-weight:700; color:#fff;">
              <input type="radio" name="profC6ERadio" value="yes" ${isC6ESelected ? 'checked' : ''} ${isForceGuest ? 'disabled' : ''} onchange="window.toggleProfileClanFields(true)">
              🛡️ Да, я боец [C6E]
            </label>
          </div>

          <div id="prof-guest-clan-fields" style="display:${isC6ESelected ? 'none' : 'grid'}; grid-template-columns:110px 1fr; gap:8px; margin-top:10px;">
            <div>
              <label class="form-label">ТЕГ КЛАНА</label>
              <input type="text" id="prof-clantag-inp" class="form-input" value="${escapeHTML(p.clanTag === 'C6E' ? '' : (p.clanTag || ''))}" placeholder="[TAG]" maxlength="7">
            </div>
            <div>
              <label class="form-label">НАЗВАНИЕ КЛАНА STANDOFF 2</label>
              <input type="text" id="prof-clanname-inp" class="form-input" value="${escapeHTML(p.clanName === 'CYBER 6 ESPORTS' ? '' : (p.clanName || ''))}" placeholder="Например: Horizon Esports (или Свободный агент)">
            </div>
          </div>

          <div id="prof-c6e-notice" style="display:${isC6ESelected ? 'block' : 'none'}; margin-top:10px; font-size:11px; color:var(--silver); background:rgba(255,255,255,0.04); padding:8px 10px; border-radius:8px; border:1px dashed var(--mirror-border-bright);">
            ⚡ <b>Верификация состава [C6E]:</b> В панель управления придёт уведомление. После подтверждения админом ты получишь статус <b>🛡️ Боец [C6E]</b>.
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:12px;">
          <div>
            <label class="form-label">4. ДЕЙСТВУЮЩИЙ K/D *</label>
            <input type="number" id="prof-kd-inp" class="form-input" step="0.01" min="0.1" max="15" value="${escapeHTML(p.kd || '1.20')}" placeholder="1.45" required>
          </div>
          <div>
            <label class="form-label">5. ВОЗРАСТ (12+) *</label>
            <input type="number" id="prof-age-inp" class="form-input" min="12" max="99" value="${escapeHTML(p.age || 16)}" placeholder="16" required>
          </div>
          <div>
            <label class="form-label">6. СТРАНА <span id="prof-flag-live">${escapeHTML(p.countryFlag || '🇷🇺')}</span></label>
            <input type="text" id="prof-country-inp" class="form-input" value="${escapeHTML(p.countryText || 'Россия')}" placeholder="РФ, Кыргызстан, Индонезия..." oninput="window.updateLiveCountryFlag(this.value)" required>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div>
            <label class="form-label">7. ВИД РАМКИ АВАТАРКИ [C6E]</label>
            <select id="prof-frame-sel" class="form-input" onchange="document.getElementById('prof-avatar-preview-frame').className = 'c6e-hex-avatar ' + this.value">
              <option value="frame-c6e-mirror" ${p.frameStyle === 'frame-c6e-mirror' ? 'selected' : ''}>💎 Зеркальный Хром [C6E]</option>
              <option value="frame-c6e-red" ${p.frameStyle === 'frame-c6e-red' ? 'selected' : ''}>🛡️ Рубиновый Щит [C6E]</option>
              <option value="frame-c6e-obsidian" ${p.frameStyle === 'frame-c6e-obsidian' ? 'selected' : ''}>🖤 Чёрный Обсидиан</option>
              <option value="frame-c6e-gold" ${p.frameStyle === 'frame-c6e-gold' ? 'selected' : ''}>👑 Золото Пантеона</option>
              <option value="frame-c6e-neon" ${p.frameStyle === 'frame-c6e-neon' ? 'selected' : ''}>⚡ Кибер-Кристалл</option>
            </select>
          </div>
          <div>
            <label class="form-label">8. ВИД БАННЕРА ПРОФИЛЯ</label>
            <select id="prof-banner-preset-sel" class="form-input" onchange="window.updateLiveBannerPreview(this.value)">
              <option value="banner-mirror" ${p.banner === 'banner-mirror' ? 'selected' : ''}>💎 Зеркальный Обсидиан [C6E]</option>
              <option value="banner-crimson" ${p.banner === 'banner-crimson' ? 'selected' : ''}>🛡️ Кровавый Рубин [C6E]</option>
              <option value="banner-chrome" ${p.banner === 'banner-chrome' ? 'selected' : ''}>⚙️ Хромированная Сталь</option>
              <option value="banner-gold" ${p.banner === 'banner-gold' ? 'selected' : ''}>👑 Золотой Пантеон</option>
              <option value="banner-emerald" ${p.banner === 'banner-emerald' ? 'selected' : ''}>🟢 Изумрудная Матрица</option>
              <option value="banner-sapphire" ${p.banner === 'banner-sapphire' ? 'selected' : ''}>🔵 Ледяной Сапфир</option>
              <option value="custom" ${isCustomBanner ? 'selected' : ''}>🖼️ Своё фото / ссылка</option>
            </select>
          </div>
        </div>

        <div id="prof-custom-banner-row" style="display:${isCustomBanner ? 'flex' : 'none'}; gap:6px; margin-bottom:12px; align-items:center;">
          <button type="button" class="chip-btn" style="border-color:var(--mirror-border-bright); color:#fff;" onclick="document.getElementById('guestBannerFileInput').click()"><i class="fas fa-image text-accent"></i> Загрузить баннер</button>
          <input type="text" id="prof-banner-custom-inp" class="form-input" value="${escapeHTML(isCustomBanner && !String(p.banner).startsWith('data:') ? p.banner : '')}" placeholder="Или ссылка на картинку баннера..." style="flex:1; padding:7px;" oninput="window.updateLiveBannerPreview('custom')">
        </div>

        <div style="margin-bottom:12px;">
          <label class="form-label">9. О СЕБЕ / ДЕВАЙС / ЛЮБИМОЕ ОРУЖИЕ (НЕОБЯЗАТЕЛЬНО)</label>
          <textarea id="prof-bio-inp" class="form-input" rows="2" placeholder="Например: Основной снайпер, играю в 4 пальца, девайс 120 FPS...">${escapeHTML(p.bio || '')}</textarea>
        </div>

        ${needPushAsk ? `
          <label style="display:flex; align-items:center; gap:9px; padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid var(--mirror-border); margin-bottom:12px; cursor:pointer; font-size:11px; color:#fff;">
            <input type="checkbox" id="prof-enable-push-chk" checked style="width:16px; height:16px; accent-color:var(--accent-light);">
            <span>📲 <b>Разрешить уведомления портала на устройство</b> (новости, @упоминания в чате, праки)</span>
          </label>
        ` : ''}

        <div id="prof-form-status-msg" style="display:none; padding:10px 12px; border-radius:9px; border:1px solid #ff5263; font-size:11.5px; font-weight:700; margin-bottom:12px;"></div>

        <button type="button" id="prof-save-submit-btn" class="btn-glitch" onclick="window.saveMyUserProfile()">
          <i class="fas fa-check-circle" style="margin-right:8px;"></i> СОХРАНИТЬ ПРОФИЛЬ И ВОЙТИ НА ПОРТАЛ [C6E]
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};
window.toggleProfileClanFields = (claimsC6E) => {
  const guestFields = document.getElementById('prof-guest-clan-fields');
  const notice = document.getElementById('prof-c6e-notice');
  const lblNo = document.getElementById('lbl-c6e-no');
  const lblYes = document.getElementById('lbl-c6e-yes');
  if (guestFields) guestFields.style.display = claimsC6E ? 'none' : 'grid';
  if (notice) notice.style.display = claimsC6E ? 'block' : 'none';
  if (lblNo) {
    lblNo.style.borderColor = !claimsC6E ? 'var(--accent-light)' : 'rgba(255,255,255,0.1)';
    lblNo.style.background = !claimsC6E ? 'var(--accent-dim)' : 'rgba(0,0,0,0.4)';
  }
  if (lblYes) {
    lblYes.style.borderColor = claimsC6E ? '#ffb300' : 'rgba(255,255,255,0.1)';
    lblYes.style.background = claimsC6E ? 'rgba(255,179,0,0.15)' : 'rgba(0,0,0,0.4)';
  }
};

window.updateLiveCountryFlag = (val) => {
  const info = resolveCountryInfo(val);
  const el = document.getElementById('prof-flag-live');
  if (el) el.innerText = info.flag;
};

// НАДЁЖНОЕ СОХРАНЕНИЕ ПРОФИЛЯ (БЕЗ ЗАВИСАНИЙ, С СИНХРОННЫМ PUSH-ЗАПРОСОМ И ЗАПИСЬЮ В FIREBASE)
window.saveMyUserProfile = async () => {
  if (checkIfCurrentUserBanned()) return;

  const nick = (document.getElementById('prof-nick-inp')?.value || '').trim().replace(/^\[[^\]]+\]\s*/, '');
  const gameId = (document.getElementById('prof-gameid-inp')?.value || '').trim();
  const kdRaw = parseFloat(String(document.getElementById('prof-kd-inp')?.value || '1.0').replace(',', '.')) || 1.0;
  const ageVal = parseInt(document.getElementById('prof-age-inp')?.value || '0', 10);
  const countryRaw = (document.getElementById('prof-country-inp')?.value || 'Россия').trim();
  const bio = (document.getElementById('prof-bio-inp')?.value || '').trim();
  const frameStyle = document.getElementById('prof-frame-sel')?.value || 'frame-c6e-red';
  const bannerPreset = document.getElementById('prof-banner-preset-sel')?.value || 'banner-crimson';
  const bannerCustom = (document.getElementById('prof-banner-custom-inp')?.value || '').trim();
  const rawAvatarInp = (document.getElementById('prof-avatar-url-inp')?.value || '').trim();
  const avatarUrl = rawAvatarInp || tempProfileAvatarDataUrl || (myLocalProfile && myLocalProfile.avatar) || 'logo.png';

  const radioYes = document.querySelector('input[name="profC6ERadio"][value="yes"]');
  const claimsC6E = Boolean(radioYes && radioYes.checked);
  const rawClanTag = (document.getElementById('prof-clantag-inp')?.value || '').replace(/[\[\]]/g, '').trim();
  const rawClanName = (document.getElementById('prof-clanname-inp')?.value || '').trim();
  const pushChk = document.getElementById('prof-enable-push-chk');

  if (!nick || nick.length < 2) {
    return showProfileFormStatus("⚠️ Введите ваш игровой никнейм в Standoff 2 (минимум 2 символа)!", true);
  }
  if (!gameId || gameId.length < 3) {
    return showProfileFormStatus("⚠️ Введите ваш игровой ID Standoff 2!", true);
  }
  if (isNaN(ageVal) || ageVal < 12) {
    return showProfileFormStatus("⚠️ Регистрация доступна строго для игроков от 12 лет (12+)!", true);
  }

  if (containsSpam(nick) || containsSpam(bio) || containsSpam(rawClanName)) {
    const bad = findMatchedSpamWord(`${nick} ${bio} ${rawClanName}`);
    logSecurityEvent('🚨 ТРЕВОГА: Запрещенное слово в профиле', nick, `Слово «${bad}»`, true);
    return showProfileFormStatus("🛡 В профиле обнаружены запрещённые слова!", true);
  }

  if (!claimsC6E && /^c6e|с6е$/i.test(rawClanTag)) {
    return showProfileFormStatus("⚠️ Тег [C6E] выдается только после одобрения заявки администрацией! Выберите «Да, я боец [C6E]» или укажите свой клан.", true);
  }

  // ВАЖНО: Запрашиваем системное разрешение на Push-уведомления СИНХРОННО в момент клика (до первого await!)
  if (pushChk && pushChk.checked && ('Notification' in window) && Notification.permission === 'default') {
    window.requestDevicePushPermission();
  }

  const saveBtn = document.getElementById('prof-save-submit-btn');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> СОХРАНЕНИЕ ПРОФИЛЯ В БАЗУ [C6E]...';
  }
  showProfileFormStatus("⏳ Синхронизация профиля с сервером CYBER 6 ESPORTS...", false);

  const countryInfo = resolveCountryInfo(countryRaw);
  const existingMem = allProfilesList.find(item => item.profileId === clientSecurityMeta.deviceId) || myLocalProfile;

  let c6eStatus = 'guest';
  let finalClanTag = rawClanTag;
  let finalClanName = rawClanName || 'Свободный агент';

  if (claimsC6E) {
    if (existingMem && existingMem.c6eStatus === 'approved') {
      c6eStatus = 'approved';
    } else {
      c6eStatus = 'pending';
    }
    finalClanTag = 'C6E';
    finalClanName = 'CYBER 6 ESPORTS';
  }

  const newProf = {
    profileId: clientSecurityMeta.deviceId,
    nick,
    gameId,
    claimsC6E,
    c6eStatus,
    clanTag: finalClanTag,
    clanName: finalClanName,
    kd: Math.min(15, Math.max(0.1, kdRaw)).toFixed(2),
    age: ageVal,
    countryText: countryInfo.label,
    countryFlag: countryInfo.flag,
    bio,
    avatar: avatarUrl,
    banner: bannerPreset === 'custom' ? (bannerCustom || tempProfileBannerDataUrl || (myLocalProfile && myLocalProfile.banner) || 'banner-mirror') : bannerPreset,
    frameStyle,
    likes: existingMem ? (parseInt(existingMem.likes, 10) || 0) : 0,
    likedBy: (existingMem && Array.isArray(existingMem.likedBy)) ? existingMem.likedBy : [],
    activityPts: (existingMem ? (parseInt(existingMem.activityPts, 10) || 10) : 15) + 5,
    lastSeen: Date.now(),
    ip: clientSecurityMeta.ip || 'Определяется...',
    device: clientSecurityMeta.deviceInfo,
    isDeveloper: Boolean(existingMem && (existingMem.isDeveloper || existingMem.devBadge)) || (nick.toLowerCase() === 'kas'),
    rejectionHandled: c6eStatus !== 'rejected'
  };

  // 1. Мгновенно сохраняем локально и разблокируем портал, чтобы интерфейс работал без единой задержки
  saveLocalProfileCache(newProf);
  const memIdx = allProfilesList.findIndex(x => x.profileId === newProf.profileId);
  if (memIdx >= 0) allProfilesList[memIdx] = newProf;
  else allProfilesList.unshift(newProf);
  renderCommunityRadarOnHome();

  // 2. Мульти-канальная синхронизация профиля с Firebase (siteData/profiles + резервные зеркала reviews/practices + TG-бот)
  try {
    await Promise.race([
      resolveClientIp(),
      new Promise(res => setTimeout(res, 700))
    ]);
    newProf.ip = clientSecurityMeta.ip || 'Не определен';

    await syncProfileToAllCloudChannels(newProf);
    saveLocalProfileCache(newProf);

    if (newProf.c6eStatus === 'pending') {
      logSecurityEvent('🛡️ Заявка на профиль бойца [C6E]', `${nick} (ID: ${gameId})`, `Игрок утверждает, что состоит в [C6E] (K/D: ${newProf.kd}, Возраст: ${newProf.age}). Ожидает проверки в админке!`);
      sendToBot(
        TG_CONFIG.groupId,
        `🛡️ <b>НОВАЯ ЗАЯВКА НА ТЕГ [C6E] НА САЙТЕ</b>\n\n` +
        `👤 <b>Ник:</b> <code>${escapeHTML(nick)}</code>\n` +
        `🆔 <b>Standoff 2 ID:</b> <code>${escapeHTML(gameId)}</code>\n` +
        `📊 <b>K/D:</b> ${escapeHTML(newProf.kd)} | <b>Возраст:</b> ${newProf.age}\n` +
        `🌍 <b>Страна:</b> ${newProf.countryFlag} ${escapeHTML(newProf.countryText)}\n` +
        `🌐 <b>IP:</b> <code>${escapeHTML(newProf.ip)}</code>\n\n` +
        `👉 Зайдите в <b>Админку v0.5.0</b>, чтобы одобрить или отклонить заявку!`
      ).catch(() => {});
      addPersonalNotification("⏳ Заявка на тег [C6E] отправлена!", "Администратор Kas проверит ваш профиль в панели управления. После одобрения вы получите официальный статус бойца [C6E].", "info");
      window.showNotify("Профиль создан! Заявка на тег [C6E] отправлена в админку Kas.", "success");
    } else {
      window.showNotify("✅ Игровой профиль сохранен! Добро пожаловать на портал [C6E].", "success");
    }
  } catch (err) {
    console.warn("Ошибка синхронизации профиля с Firestore:", err);
    window.showNotify("Профиль сохранён!", "success");
  } finally {
    setGateLockState(false);
    setTimeout(checkAndShowReleaseNotification, 800);
    const modal = document.getElementById('c6e-profile-gate-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.classList.remove('gate-fullscreen');
    }
  }
};

// ПРОСМОТР ЧУЖОГО ИЛИ СВОЕГО ПОЛНОГО ПРОФИЛЯ + СИСТЕМА ЛАЙКОВ ❤️
window.openPublicProfileModal = (profileId) => {
  const p = allProfilesList.find(x => x.profileId === profileId) || (myLocalProfile && myLocalProfile.profileId === profileId ? myLocalProfile : null);
  if (!p) return;

  let modal = document.getElementById('c6e-public-profile-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'c6e-public-profile-modal';
    modal.className = 'c6e-modal-overlay';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    document.body.appendChild(modal);
  }

  const info = getDisplayTagAndBadge(p);
  const isOnline = (Date.now() - (p.lastSeen || 0)) < 15 * 60 * 1000;
  const isMe = myLocalProfile && myLocalProfile.profileId === p.profileId;
  const alreadyLiked = Array.isArray(p.likedBy) && p.likedBy.includes(clientSecurityMeta.deviceId);

  const isPresetBanner = ['banner-mirror','banner-crimson','banner-chrome','banner-gold','banner-emerald','banner-sapphire'].includes(p.banner);
  const bannerClass = isPresetBanner ? p.banner : 'banner-mirror';
  const bannerStyle = !isPresetBanner && p.banner ? `background-image:url('${escapeHTML(p.banner)}');` : '';

  modal.innerHTML = `
    <div class="c6e-modal-card" style="max-width:500px; padding:0;">
      <div class="prof-banner-box ${bannerClass}" style="${bannerStyle}">
        <button type="button" class="c6e-modal-close" style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.65);" onclick="document.getElementById('c6e-public-profile-modal').classList.remove('active')">✕</button>
        <div style="position:absolute; top:12px; left:12px; display:flex; gap:6px;">
          <span style="padding:4px 9px; border-radius:20px; background:rgba(0,0,0,0.7); border:1px solid ${isOnline ? '#00e676' : '#666'}; font-family:var(--font-tech); font-size:9px; font-weight:800; color:${isOnline ? '#00e676' : '#aaa'};">
            ${isOnline ? '🟢 ОНЛАЙН НА САЙТЕ' : '⚪ БЫЛ НЕДАВНО'}
          </span>
        </div>
      </div>

      <div style="padding:0 20px 20px 20px; margin-top:-38px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div class="c6e-hex-avatar ${escapeHTML(p.frameStyle || 'frame-c6e-red')}" style="width:78px; height:78px;">
            <img src="${escapeHTML(p.avatar || 'logo.png')}" onerror="this.src='logo.png'">
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="chip-btn" style="border-color:#ff5263; color:${alreadyLiked ? '#fff' : '#ff5263'}; background:${alreadyLiked ? 'rgba(212,38,56,0.35)' : 'rgba(0,0,0,0.5)'}; padding:8px 13px; font-size:11px;" onclick="window.likeUserProfile('${escapeHTML(p.profileId)}')">
              ❤️ Лайк (${p.likes || 0})
            </button>
            ${isMe ? `
              <button type="button" class="chip-btn" style="border-color:var(--accent-light); color:#fff; padding:8px 12px;" onclick="document.getElementById('c6e-public-profile-modal').classList.remove('active'); window.openMyProfileModal(false);">
                <i class="fas fa-pen"></i> Изменить
              </button>
            ` : `
              <button type="button" class="chip-btn" style="border-color:#00e676; color:#00e676; padding:8px 12px;" onclick="document.getElementById('c6e-public-profile-modal').classList.remove('active'); window.mentionUserInChat('${escapeHTML(p.nick).replace(/'/g, "\\'")}')">
                💬 @Упомянуть
              </button>
            `}
          </div>
        </div>

        <div style="font-family:var(--font-tech); font-size:18px; font-weight:900; color:#fff; display:flex; align-items:center; gap:7px; flex-wrap:wrap;">
          <span>${escapeHTML(p.countryFlag || '🌍')}</span>
          ${info.tagStr ? `<span style="color:var(--accent-light);">${escapeHTML(info.tagStr)}</span>` : ''}
          <span>${escapeHTML(p.nick)}</span>
          ${renderDevVerifiedCheckHTML(p)}
        </div>
        <div style="font-size:11px; margin-top:4px;">
          ${info.badgeHtml} • <span style="color:var(--silver-muted);">${escapeHTML(p.countryText || 'Россия')} • ${escapeHTML(p.age || 16)} лет</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin:14px 0; background:rgba(255,255,255,0.03); padding:11px; border-radius:11px; border:1px solid var(--glass-border); text-align:center;">
          <div>
            <div style="font-family:var(--font-tech); font-size:15px; font-weight:900; color:var(--success);">${escapeHTML(p.kd || '1.00')}</div>
            <div style="font-size:8px; color:var(--silver-muted); text-transform:uppercase;">ДЕЙСТВУЮЩИЙ K/D</div>
          </div>
          <div style="border-left:1px solid rgba(255,255,255,0.07); border-right:1px solid rgba(255,255,255,0.07);">
            <div style="font-family:var(--font-tech); font-size:13px; font-weight:900; color:#fff;">${escapeHTML(p.gameId || '—')}</div>
            <div style="font-size:8px; color:var(--silver-muted); text-transform:uppercase;">STANDOFF 2 ID</div>
          </div>
          <div>
            <div style="font-family:var(--font-tech); font-size:15px; font-weight:900; color:#ffb300;">⚡ ${p.activityPts || 15}</div>
            <div style="font-size:8px; color:var(--silver-muted); text-transform:uppercase;">АКТИВНОСТЬ</div>
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:11px 13px; font-size:12px; color:#ccc; line-height:1.55;">
          <div style="font-size:9px; font-family:var(--font-tech); color:var(--silver-muted); margin-bottom:4px;">ОПИСАНИЕ ПРОФИЛЯ / БИОГРАФИЯ:</div>
          ${p.bio ? escapeHTML(p.bio) : '<span style="color:#666; font-style:italic;">Игрок пока не добавил биографию.</span>'}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
};

window.likeUserProfile = async (targetProfileId) => {
  if (checkIfCurrentUserBanned()) return;
  try {
    const idx = allProfilesList.findIndex(x => x.profileId === targetProfileId);
    if (idx === -1) return;

    const target = { ...allProfilesList[idx] };
    const likedBy = Array.isArray(target.likedBy) ? [...target.likedBy] : [];
    if (likedBy.includes(clientSecurityMeta.deviceId)) {
      return window.showNotify("Вы уже ставили ❤️ лайк этому профилю!", "error");
    }

    likedBy.push(clientSecurityMeta.deviceId);
    target.likedBy = likedBy;
    target.likes = (parseInt(target.likes, 10) || 0) + 1;
    target.activityPts = (parseInt(target.activityPts, 10) || 15) + 3;
    target.lastSeen = Date.now();
    allProfilesList[idx] = target;

    await syncProfileToAllCloudChannels(target);
    renderCommunityRadarOnHome();
    window.showNotify(`❤️ Вы поставили лайк профилю ${target.nick}!`, "success");
    if (document.getElementById('c6e-public-profile-modal')?.classList.contains('active')) {
      window.openPublicProfileModal(targetProfileId);
    }
  } catch (e) {}
};

// ФИЛЬТРАЦИЯ И РЕНДЕР СООБЩЕСТВА И ОНЛАЙНА НА ГЛАВНОЙ
window.setHomeCommunityFilter = (flt) => {
  currentHomeCommFilter = flt || 'all';
  ['all', 'c6e', 'guest', 'top'].forEach(k => {
    const btn = document.getElementById('comm-flt-' + k);
    if (btn) {
      btn.style.borderColor = (k === currentHomeCommFilter) ? 'var(--accent-light)' : 'var(--glass-border)';
      btn.style.color = (k === currentHomeCommFilter) ? '#fff' : 'var(--silver)';
    }
  });
  renderCommunityRadarOnHome();
};

function renderCommunityRadarOnHome() {
  const grid = document.getElementById('home-online-profiles-grid');
  const onlineEl = document.getElementById('comm-online-count');
  const totalEl = document.getElementById('comm-total-count');
  const statProfEl = document.getElementById('home-stat-profiles-count');
  if (!grid) return;

  const now = Date.now();
  let sourceList = [...allProfilesList];
  if (myLocalProfile && myLocalProfile.nick && !sourceList.some(p => p.profileId === myLocalProfile.profileId)) {
    sourceList.unshift(myLocalProfile);
  }

  const onlineCount = Math.max(1, sourceList.filter(p => (now - (p.lastSeen || 0)) < 15 * 60 * 1000).length);
  const totalCount = Math.max(1, sourceList.length);

  if (onlineEl) onlineEl.innerText = String(onlineCount);
  if (totalEl) totalEl.innerText = String(totalCount);
  if (statProfEl) statProfEl.innerText = String(totalCount);

  let filtered = [...sourceList];
  if (currentHomeCommFilter === 'c6e') {
    filtered = filtered.filter(p => p.c6eStatus === 'approved');
  } else if (currentHomeCommFilter === 'guest') {
    filtered = filtered.filter(p => p.c6eStatus !== 'approved');
  } else if (currentHomeCommFilter === 'top') {
    filtered.sort((a, b) => (parseInt(b.likes, 10) || 0) - (parseInt(a.likes, 10) || 0));
  } else {
    filtered.sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="font-size:11px; color:var(--silver-muted); padding:16px; text-align:center; grid-column:1/-1;">В этой категории пока нет профилей.</div>`;
    return;
  }

  grid.innerHTML = filtered.slice(0, 12).map(p => {
    const info = getDisplayTagAndBadge(p);
    const isOnline = (now - (p.lastSeen || 0)) < 15 * 60 * 1000;
    const isPresetBanner = ['banner-mirror','banner-crimson','banner-chrome','banner-gold','banner-emerald','banner-sapphire'].includes(p.banner);
    const bannerClass = isPresetBanner ? p.banner : 'banner-mirror';
    const bannerStyle = !isPresetBanner && p.banner ? `background-image:url('${escapeHTML(p.banner)}');` : '';

    return `
      <div class="mini-prof-card" onclick="window.openPublicProfileModal('${escapeHTML(p.profileId)}')">
        <div class="mini-prof-top ${bannerClass}" style="${bannerStyle}">
          <span style="position:absolute; top:6px; right:8px; font-size:9px; font-family:var(--font-tech); color:#fff; background:rgba(0,0,0,0.65); padding:2px 6px; border-radius:10px;">
            ❤️ ${p.likes || 0}
          </span>
        </div>
        <div class="mini-prof-body">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:6px;">
            <div class="c6e-hex-avatar ${escapeHTML(p.frameStyle || 'frame-c6e-red')}" style="width:42px; height:42px;">
              <img src="${escapeHTML(p.avatar || 'logo.png')}" onerror="this.src='logo.png'">
            </div>
            <span style="font-size:8.5px; font-family:var(--font-tech); font-weight:800; color:${isOnline ? 'var(--success)' : 'var(--silver-muted)'};">
              ${isOnline ? '🟢 ONLINE' : '⚪ OFFLINE'}
            </span>
          </div>
          <div style="font-family:var(--font-tech); font-size:12px; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:4px;">
            <span style="overflow:hidden; text-overflow:ellipsis;">${escapeHTML(p.countryFlag || '🌍')} ${info.tagStr ? `<span style="color:var(--accent-light);">${escapeHTML(info.tagStr)}</span> ` : ''}${escapeHTML(p.nick)}</span>
            ${renderDevVerifiedCheckHTML(p)}
          </div>
          <div style="font-size:9.5px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${info.badgeHtml}
          </div>
          <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--silver-muted); margin-top:6px; padding-top:5px; border-top:1px solid rgba(255,255,255,0.06);">
            <span>K/D: <b style="color:var(--success);">${escapeHTML(p.kd || '1.00')}</b></span>
            <span>⚡ ${p.activityPts || 15}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ЖИВЫЕ ВИДЖЕТЫ НА ГЛАВНОМ ЭКРАНЕ: ТОП-3 ПАНТЕОНА + ПОСЛЕДНИЙ МАТЧ С ТАБОМ
function renderHomeInnovationsWidgets() {
  // 1. Мини-подиум Топ-3 Пантеона
  const miniPanth = document.getElementById('home-pantheon-mini-grid');
  if (miniPanth) {
    const standings = buildPantheonStandings();
    if (!standings.length) {
      miniPanth.innerHTML = `<div style="font-size:11px; color:var(--silver-muted); padding:10px;">Загрузка рейтинга бойцов [C6E]...</div>`;
    } else {
      const prizes = ['🥇 500 GOLD', '🥈 250 GOLD', '🥉 150 GOLD'];
      const rankCls = ['top-1', 'top-2', 'top-3'];
      miniPanth.innerHTML = standings.slice(0, 3).map((item, idx) => {
        const safeNick = escapeHTML(item.player.nick).replace(/'/g, "\\'");
        return `
          <div class="home-podium-mini-item ${rankCls[idx]}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:var(--font-tech); font-size:9px; font-weight:900; color:#ffb300;">${prizes[idx]}</span>
              <span style="font-family:var(--font-tech); font-size:12px; font-weight:900; color:#fff;">${item.pts} <span style="font-size:8.5px; color:#ffb300;">PTS</span></span>
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin:4px 0;">
              <img src="${item.player.img || 'logo.png'}" onerror="this.src='logo.png'" style="width:40px; height:40px; border-radius:9px; object-fit:cover; border:1px solid rgba(255,255,255,0.2);">
              <div style="min-width:0; flex:1;">
                <div style="font-family:var(--font-tech); font-size:12.5px; font-weight:900; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  [C6E] ${escapeHTML(item.player.nick)}
                </div>
                <div style="font-size:9.5px; color:var(--silver-muted);">
                  LIVE K/D: <b style="color:var(--success);">${item.analytics.effectiveKd.toFixed(2)}</b> • Бустов: 🔥 ${item.boostCount}
                </div>
              </div>
            </div>
            <button type="button" class="boost-btn" style="padding:7px 10px; font-size:9.5px;" onclick="window.boostPantheonPlayer('${safeNick}')">
              🔥 ДАТЬ БУСТ (+25 PTS)
            </button>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Виджет последнего сыгранного матча [C6E] в Match Center
  const latestBox = document.getElementById('home-latest-match-box');
  if (latestBox) {
    if (!allHistoryData || allHistoryData.length === 0) {
      latestBox.innerHTML = '';
    } else {
      const lastM = allHistoryData[allHistoryData.length - 1];
      const win = parseInt(lastM.our, 10) > parseInt(lastM.their, 10);
      latestBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:rgba(0,0,0,0.42); border:1px solid rgba(255,255,255,0.07); border-left:3px solid ${win ? 'var(--success)' : '#ff5263'}; border-radius:10px; padding:10px 14px;">
          <div>
            <div style="font-family:var(--font-tech); font-size:9px; color:var(--silver-muted); letter-spacing:1px;">
              ПОСЛЕДНИЙ ЗАВЕРШЕННЫЙ МАТЧ • ${escapeHTML(lastM.map || 'КАРТА')}
            </div>
            <div style="font-family:var(--font-tech); font-size:13px; font-weight:900; color:#fff; margin-top:3px;">
              [C6E] <span style="color:${win ? 'var(--success)' : '#ff5263'};">${escapeHTML(lastM.our)} : ${escapeHTML(lastM.their)}</span> ${escapeHTML(lastM.enemy)}
            </div>
          </div>
          <button type="button" class="chip-btn" style="border-color:var(--accent-light); color:#fff;" onclick="selectTab('history', document.getElementById('btn-history'))">
            <i class="fas fa-table text-accent"></i> Смотреть Таб и скрин ➔
          </button>
        </div>
      `;
    }
  }
}

// Запускаем обновление виджетов Главного экрана
setInterval(renderHomeInnovationsWidgets, 2500);
setTimeout(renderHomeInnovationsWidgets, 600);

// СИНХРОННЫЙ ПЕРВИЧНЫЙ ГЕЙТ ПРИ ЗАГРУЗКЕ САЙТА (БЕЗ ОЖИДАНИЯ СЕТИ И БЕЗ ПРОКРУТКИ ЗАДНЕГО ФОНА)
if (!myLocalProfile || !myLocalProfile.nick) {
  setGateLockState(true);
  setTimeout(() => {
    window.openMyProfileModal(true);
  }, 50);
} else {
  setGateLockState(false);
}

// НАДЁЖНАЯ СИНХРОНИЗАЦИЯ ПРОФИЛЕЙ ЧЕРЕЗ ОСНОВНОЙ КАНАЛ (profiles) И РЕЗЕРВНЫЕ КАНАЛЫ (reviews / practices / localStorage)
let profilesFromMainDoc = [];
let profilesFromMirrorDoc = [];

function mergeProfilesLists(...arrays) {
  const map = new Map();
  for (const arr of arrays) {
    if (!Array.isArray(arr)) continue;
    for (const p of arr) {
      if (!p || !p.profileId || !p.nick) continue;
      if (p._deleted) {
        map.delete(p.profileId);
        continue;
      }
      const prev = map.get(p.profileId);
      if (!prev || (p.adminUpdatedAt || p.lastSeen || 0) >= (prev.adminUpdatedAt || prev.lastSeen || 0)) {
        map.set(p.profileId, p);
      }
    }
  }
  return Array.from(map.values());
}

async function syncProfileToAllCloudChannels(profToSave) {
  // Сохраняем в общее локальное зеркало браузера (мгновенно видно в соседней вкладке админки на том же устройстве)
  try {
    const rawMirror = localStorage.getItem('c6e_shared_profiles_mirror');
    const localArr = rawMirror ? JSON.parse(rawMirror) : [];
    const mergedLocal = mergeProfilesLists(localArr, [profToSave]);
    localStorage.setItem('c6e_shared_profiles_mirror', JSON.stringify(mergedLocal));
  } catch (e) {}

  let syncedAny = false;

  // Канал 1: Основной документ siteData/profiles
  try {
    const ref = doc(db, DB_COLLECTION, "profiles");
    const snap = await getDoc(ref);
    const current = (snap.exists() && Array.isArray(snap.data().list)) ? snap.data().list : [];
    const existing = current.find(x => x.profileId === profToSave.profileId);
    if (profToSave.claimsC6E && existing && existing.c6eStatus === 'approved') {
      profToSave.c6eStatus = 'approved';
    }
    const updated = mergeProfilesLists(current, [profToSave]);
    await setDoc(ref, { list: updated }, { merge: true });
    syncedAny = true;
  } catch (e1) {}

  // Канал 2: Резервное зеркало внутри siteData/reviews (гарантированно разрешено правилами Firestore для гостей!)
  try {
    const revRef = doc(db, DB_COLLECTION, "reviews");
    const revSnap = await getDoc(revRef);
    const curMirror = (revSnap.exists() && Array.isArray(revSnap.data().c6e_profiles)) ? revSnap.data().c6e_profiles : [];
    const existingM = curMirror.find(x => x.profileId === profToSave.profileId);
    if (profToSave.claimsC6E && existingM && existingM.c6eStatus === 'approved') {
      profToSave.c6eStatus = 'approved';
    }
    const updatedMirror = mergeProfilesLists(curMirror, [profToSave]);
    if (revSnap.exists()) {
      await updateDoc(revRef, { c6e_profiles: updatedMirror });
    } else {
      await setDoc(revRef, { list: [], c6e_profiles: updatedMirror }, { merge: true });
    }
    syncedAny = true;
  } catch (e2) {}

  // Канал 3: Резервное зеркало внутри siteData/practices и siteData/security_logs
  try {
    const prRef = doc(db, DB_COLLECTION, "practices");
    const prSnap = await getDoc(prRef);
    const curPr = (prSnap.exists() && Array.isArray(prSnap.data().c6e_profiles)) ? prSnap.data().c6e_profiles : [];
    const updatedPr = mergeProfilesLists(curPr, [profToSave]);
    if (prSnap.exists()) await updateDoc(prRef, { c6e_profiles: updatedPr });
  } catch (e3) {}

  try {
    const secRef = doc(db, DB_COLLECTION, "security_logs");
    const secSnap = await getDoc(secRef);
    const curSec = (secSnap.exists() && Array.isArray(secSnap.data().c6e_profiles)) ? secSnap.data().c6e_profiles : [];
    const updatedSec = mergeProfilesLists(curSec, [profToSave]);
    await setDoc(secRef, { c6e_profiles: updatedSec }, { merge: true });
  } catch (e4) {}
}

function handleMergedProfilesUpdate() {
  let localMirror = [];
  try {
    const rawM = localStorage.getItem('c6e_shared_profiles_mirror');
    if (rawM) localMirror = JSON.parse(rawM);
  } catch (e) {}

  allProfilesList = mergeProfilesLists(localMirror, profilesFromMirrorDoc, profilesFromMainDoc);
  const remoteMe = allProfilesList.find(x => x.profileId === clientSecurityMeta.deviceId);

  if (remoteMe) {
    if (myLocalProfile && myLocalProfile.c6eStatus === 'pending' && remoteMe.c6eStatus === 'approved') {
      addPersonalNotification("🛡️ Вы приняты в [C6E] на сайте!", "Основатель Kas подтвердил вашу принадлежность к клану CYBER 6 ESPORTS!", "success");
      window.showNotify("🛡️ Администрация подтвердила ваш профиль бойца [C6E]!", "success");
    }
    if (remoteMe.c6eStatus === 'rejected') {
      saveLocalProfileCache(remoteMe);
      setGateLockState(true);
      addPersonalNotification("❌ Отказ в регистрации под тегом [C6E]", "Администратор отклонил заявку на статус бойца [C6E]. Укажите ваш реальный клан в профиле.", "error");
      window.openMyProfileModal(true, "Вы не числитесь в основном или резервном составе CYBER 6 ESPORTS.");
    } else {
      if (myLocalProfile && (remoteMe.likes || 0) > (myLocalProfile.likes || 0)) {
        addPersonalNotification("❤️ Новый лайк профиля!", `Вашему игровому профилю поставили лайк! Всего лайков: ${remoteMe.likes}`, "info");
      }
      saveLocalProfileCache(remoteMe);
    }
  } else if (!myLocalProfile || !myLocalProfile.nick) {
    setGateLockState(true);
    window.openMyProfileModal(true);
  } else {
    // Если профиль создан локально, но еще не попал в облако — автоматически отправляем во все каналы
    syncProfileToAllCloudChannels(myLocalProfile).catch(() => {});
  }

  renderCommunityRadarOnHome();
  renderGlobalChatSection();
}

onSnapshot(doc(db, DB_COLLECTION, "profiles"), (snap) => {
  profilesFromMainDoc = (snap.exists() && Array.isArray(snap.data().list)) ? snap.data().list : [];
  handleMergedProfilesUpdate();
}, () => {
  handleMergedProfilesUpdate();
});

onSnapshot(doc(db, DB_COLLECTION, "reviews"), (snap) => {
  if (snap.exists() && Array.isArray(snap.data().c6e_profiles)) {
    profilesFromMirrorDoc = snap.data().c6e_profiles;
    handleMergedProfilesUpdate();
  }
  if (snap.exists() && Array.isArray(snap.data().c6e_chat)) {
    const now = Date.now();
    const mirrorMsgs = snap.data().c6e_chat.filter(m => (now - (m.ts || 0)) < CHAT_RETENTION_MS);
    if (mirrorMsgs.length >= globalChatMessages.length) {
      globalChatMessages = mirrorMsgs;
      renderGlobalChatSection();
    }
  }
});

// Обновление онлайна каждые 3 минуты
setInterval(async () => {
  if (!myLocalProfile || !myLocalProfile.nick) return;
  try {
    const ref = doc(db, DB_COLLECTION, "profiles");
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    let list = Array.isArray(snap.data().list) ? [...snap.data().list] : [];
    const idx = list.findIndex(x => x.profileId === clientSecurityMeta.deviceId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], lastSeen: Date.now() };
      await setDoc(ref, { list }, { merge: true });
    }
  } catch (e) {}
}, 180000);

// ============================================================================
// ОБЩИЙ ЧАТ ИГРОКОВ С АВТО-ОЧИСТКОЙ КАЖДЫЕ 12 ЧАСОВ И @УПОМИНАНИЯМИ
// ============================================================================
const CHAT_RETENTION_MS = 12 * 60 * 60 * 1000; // 12 часов

function getRemainingChatResetText() {
  const elapsed = Date.now() - (globalChatLastPurge || Date.now());
  const rem = Math.max(0, CHAT_RETENTION_MS - (elapsed % CHAT_RETENTION_MS));
  const h = Math.floor(rem / (1000 * 60 * 60));
  const m = Math.floor((rem % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}ч ${m}м`;
}

function formatChatMessageTextHTML(rawText) {
  const safe = escapeHTML(rawText || '');
  return safe.replace(/@([A-Za-zА-Яа-яЁё0-9_@.\-]{2,24})/g, '<span class="chat-mention-tag">@$1</span>');
}

window.mentionUserInChat = (nick) => {
  selectTab('chat', document.getElementById('btn-chat'));
  setTimeout(() => {
    const inp = document.getElementById('global-chat-input');
    if (inp) {
      const clean = String(nick || '').replace(/^\[[^\]]+\]\s*/, '').trim();
      if (!inp.value.includes(`@${clean}`)) {
        inp.value = `${inp.value ? inp.value + ' ' : ''}@${clean} `;
      }
      inp.focus();
    }
  }, 150);
};

function renderGlobalChatSection() {
  const root = document.getElementById('global-chat-root');
  const now = Date.now();
  const validMsgs = globalChatMessages.filter(m => (now - (m.ts || 0)) < CHAT_RETENTION_MS);

  const chatLivePill = document.getElementById('home-chat-live-pill');
  if (chatLivePill) {
    chatLivePill.innerText = validMsgs.length > 0 ? `${validMsgs.length} СООБЩ.` : '12Ч ЧАТ';
  }

  if (!root) return;

  const existingInputVal = document.getElementById('global-chat-input')?.value || '';
  const myCleanNick = myLocalProfile ? myLocalProfile.nick.toLowerCase() : '';

  root.innerHTML = `
    <div class="chat-box-wrap">
      <div class="chat-top-bar">
        <div>
          <div style="font-family:var(--font-tech); font-size:13px; font-weight:900; color:#fff; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-comments text-accent"></i> ОБЩИЙ ЧАТ ИГРОКОВ ПОРТАЛА [C6E]
          </div>
          <div style="font-size:10px; color:var(--silver-muted); margin-top:2px;">
            Нажми на <b>@Ник</b> игрока, чтобы упомянуть его (ему придёт уведомление в 🔔 колокольчик и на телефон)
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="padding:4px 10px; border-radius:20px; background:rgba(255,179,0,0.12); border:1px solid rgba(255,179,0,0.4); font-family:var(--font-tech); font-size:9px; color:#ffb300; font-weight:800;">
            🧹 Авто-очистка чата через: ${getRemainingChatResetText()}
          </span>
        </div>
      </div>

      <div style="padding:7px 12px; background:rgba(0,0,0,0.45); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; gap:6px; overflow-x:auto; white-space:nowrap;">
        <span style="font-size:9px; font-family:var(--font-tech); color:var(--silver-muted);">УПОМЯНУТЬ:</span>
        ${allProfilesList.slice(0, 10).map(p => {
          const safeN = escapeHTML(p.nick).replace(/'/g, "\\'");
          return `<button type="button" class="chip-btn" style="padding:3px 8px; font-size:9.5px;" onclick="window.mentionUserInChat('${safeN}')">${escapeHTML(p.countryFlag || '🌍')} @${escapeHTML(p.nick)}</button>`;
        }).join('')}
      </div>

      <div class="chat-messages-area" id="chat-messages-scroll">
        ${validMsgs.length === 0 ? `
          <div style="text-align:center; margin:auto; padding:30px; color:var(--silver-muted); font-size:12px;">
            <i class="fas fa-comment-dots" style="font-size:28px; color:var(--accent-light); margin-bottom:8px; display:block;"></i>
            Чат чист! Напиши первое сообщение или позови игроков через <b>@Ник</b>.
          </div>
        ` : validMsgs.map(m => {
          const isMine = myLocalProfile && m.senderId === myLocalProfile.profileId;
          const mentionsMe = myCleanNick && String(m.text || '').toLowerCase().includes(`@${myCleanNick}`);
          const senderProf = allProfilesList.find(x => x.profileId === m.senderId) || m;
          const isDevSender = Boolean(m.isFounder || m.isDeveloper || hasDeveloperBadge(senderProf));
          const tagStr = (m.c6eStatus === 'approved' || isDevSender) ? '[C6E]' : (m.clanTag ? `[${String(m.clanTag).replace(/[\[\]\?]/g, '')}]` : '');
          const devCheckHtml = isDevSender ? `<span class="c6e-dev-verified-badge" title="Официальный Разработчик CYBER 6 ESPORTS">✓</span>` : '';
          const rolePill = isDevSender
            ? '<span class="c6e-dev-pill-tag">⚡ DEV [C6E]</span>'
            : (m.c6eStatus === 'approved'
                ? '<span style="color:var(--silver); font-size:9px; font-weight:800;">🛡️ [C6E]</span>'
                : '<span style="color:var(--silver-muted); font-size:9px;">💎 Гость</span>');

          return `
            <div class="chat-msg-item ${isMine ? 'is-mine' : ''} ${mentionsMe ? 'mention-me' : ''}">
              <div class="c6e-hex-avatar ${escapeHTML(m.frameStyle || 'frame-c6e-red')}" style="width:38px; height:38px; cursor:pointer;" onclick="window.openPublicProfileModal('${escapeHTML(m.senderId || '')}')">
                <img src="${escapeHTML(m.avatar || 'logo.png')}" onerror="this.src='logo.png'">
              </div>
              <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:3px;">
                  <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
                    <span style="cursor:pointer; font-family:var(--font-tech); font-size:11px; font-weight:800; color:#fff; display:inline-flex; align-items:center; gap:4px;" onclick="window.openPublicProfileModal('${escapeHTML(m.senderId || '')}')">
                      <span>${escapeHTML(m.countryFlag || '🌍')} ${tagStr ? `<span style="color:var(--accent-light);">${escapeHTML(tagStr)}</span> ` : ''}${escapeHTML(m.nick || 'Игрок')}</span>
                      ${devCheckHtml}
                    </span>
                    ${rolePill}
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:9px; color:var(--silver-muted);">${escapeHTML(m.timeStr || '')}</span>
                    ${!isMine ? `<button type="button" style="background:none; border:none; color:#ffb300; font-size:10px; cursor:pointer; font-family:var(--font-tech); font-weight:700;" onclick="window.mentionUserInChat('${escapeHTML(m.nick || '').replace(/'/g, "\\'")}')">@Ответить</button>` : ''}
                  </div>
                </div>
                <div style="font-size:12.5px; color:#e4e4e2; line-height:1.5; word-break:break-word;">
                  ${formatChatMessageTextHTML(m.text)}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <form class="chat-input-bar" onsubmit="window.sendGlobalChatMessage(event)">
        <input type="text" id="global-chat-input" class="form-input" value="${escapeHTML(existingInputVal)}" placeholder="Напиши в общий чат (используй @Ник для упоминания)..." maxlength="280" style="margin:0; flex:1;" required>
        <button type="submit" class="btn-glitch" style="width:auto; padding:10px 18px; margin:0;">
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  `;

  const sc = document.getElementById('chat-messages-scroll');
  if (sc) sc.scrollTop = sc.scrollHeight;
}

window.sendGlobalChatMessage = async (e) => {
  if (e) e.preventDefault();
  if (checkIfCurrentUserBanned()) return;
  if (!myLocalProfile || !myLocalProfile.nick) {
    window.showNotify("Сначала создайте игровой профиль!", "error");
    return window.openMyProfileModal(true);
  }

  const inp = document.getElementById('global-chat-input');
  const text = (inp?.value || '').trim();
  if (!text) return;

  if (containsSpam(text)) {
    const bad = findMatchedSpamWord(text);
    logSecurityEvent('🚨 ТРЕВОГА: Запрещенное слово в чате', myLocalProfile.nick, `Слово «${bad}»: "${text.slice(0, 50)}"`, true);
    return window.showNotify("🛡 C6E Shield: Сообщение заблокировано анти-мат фильтром!", "error");
  }

  if (inp) inp.value = '';

  try {
    const ref = doc(db, DB_COLLECTION, "global_chat");
    const snap = await getDoc(ref);
    const now = Date.now();
    let messages = (snap.exists() && Array.isArray(snap.data().messages)) ? snap.data().messages : [];
    let lastPurgeTs = (snap.exists() && snap.data().lastPurgeTs) ? snap.data().lastPurgeTs : now;

    messages = messages.filter(m => (now - (m.ts || 0)) < CHAT_RETENTION_MS);
    if (now - lastPurgeTs >= CHAT_RETENTION_MS) {
      messages = [];
      lastPurgeTs = now;
    }

    const newMsg = {
      id: now + Math.floor(Math.random() * 1000),
      senderId: myLocalProfile.profileId,
      nick: myLocalProfile.nick,
      clanTag: myLocalProfile.c6eStatus === 'approved' ? 'C6E' : (myLocalProfile.clanTag || ''),
      c6eStatus: myLocalProfile.c6eStatus || 'guest',
      isDeveloper: hasDeveloperBadge(myLocalProfile),
      avatar: myLocalProfile.avatar || 'logo.png',
      frameStyle: myLocalProfile.frameStyle || 'frame-c6e-red',
      countryFlag: myLocalProfile.countryFlag || '🌍',
      text,
      timeStr: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      ts: now
    };

    messages.push(newMsg);
    if (messages.length > 90) messages = messages.slice(-90);

    try {
      await setDoc(ref, { messages, lastPurgeTs }, { merge: true });
    } catch (eChat) {}
    try {
      await updateDoc(doc(db, DB_COLLECTION, "reviews"), { c6e_chat: messages, c6e_chat_purge: lastPurgeTs });
    } catch (eRevChat) {}
  } catch (err) {
    window.showNotify("Ошибка отправки сообщения", "error");
  }
};

let lastProcessedChatMsgId = 0;
onSnapshot(doc(db, DB_COLLECTION, "global_chat"), (snap) => {
  const now = Date.now();
  if (snap.exists()) {
    const rawMsgs = Array.isArray(snap.data().messages) ? snap.data().messages : [];
    globalChatLastPurge = snap.data().lastPurgeTs || now;
    globalChatMessages = rawMsgs.filter(m => (now - (m.ts || 0)) < CHAT_RETENTION_MS);

    if (myLocalProfile && myLocalProfile.nick && globalChatMessages.length > 0) {
      const latest = globalChatMessages[globalChatMessages.length - 1];
      if (latest.id !== lastProcessedChatMsgId && latest.ts > sessionBootTime && latest.senderId !== myLocalProfile.profileId) {
        lastProcessedChatMsgId = latest.id;
        const myClean = myLocalProfile.nick.toLowerCase();
        const txtLow = String(latest.text || '').toLowerCase();
        if (txtLow.includes(`@${myClean}`) || txtLow.includes('@all') || txtLow.includes('@все')) {
          addPersonalNotification(
            `💬 ${latest.nick} упомянул вас в чате!`,
            latest.text,
            'mention',
            'chat'
          );
          if (window.showNotify) {
            window.showNotify(`🔔 ${latest.nick} упомянул вас в Общем чате!`, 'success');
          }
        }
      }
    }
  } else {
    globalChatMessages = [];
  }
  renderGlobalChatSection();
});

// ============================================================================
// РАЗДЕЛ «МАГАЗИН [C6E]» (ЭЛЕГАНТНЫЙ КИБЕР-МАРКЕТ С АЖИОТАЖЕМ)
// ============================================================================
function renderShopSection() {
  const root = document.getElementById('c6e-shop-root');
  if (!root) return;

  const waitCount = Array.isArray(shopConfigData.waitlist) ? shopConfigData.waitlist.length : 0;
  const isWaiting = Array.isArray(shopConfigData.waitlist) && shopConfigData.waitlist.some(w => w.deviceId === clientSecurityMeta.deviceId);

  const teaserItems = [
    { icon: 'fa-coins', color: 'var(--silver)', badge: 'LOCKED // SOON', title: 'ПАКИ ГОЛДЫ & GOLD PASS', desc: 'Мгновенное пополнение Голды и боевых пропусков Standoff 2 по закрытому курсу для участников портала [C6E].' },
    { icon: 'fa-sliders-h', color: 'var(--accent-light)', badge: 'PRO CONFIGS', title: 'ПРИВАТНЫЕ НАСТРОЙКИ БОЙЦОВ [C6E]', desc: 'Эксклюзивные паки кастомной раскладки, точной сенсы, прицелов и секретов оттяжки от основы Cyber 6 Esports.' },
    { icon: 'fa-crown', color: 'var(--silver)', badge: 'VIP STATUS', title: 'КАСТОМНЫЕ VIP-РАМКИ И БАННЕРЫ', desc: 'Уникальные зеркальные рамки профиля, выделенный ник в Общем чате и приоритетный слот на праках.' },
    { icon: 'fa-trophy', color: 'var(--accent-light)', badge: 'TOURNAMENT SLOTS', title: 'БИЛЕТЫ НА ЗАКРЫТЫЕ ТУРНИРЫ C6E', desc: 'Прямые инвайты на еженедельные дуэли 1v1, 2v2 и 5v5 с гарантированным призовым фондом в Голде.' }
  ];

  root.innerHTML = `
    <div class="shop-vault-hero">
      <div style="display:inline-flex; align-items:center; gap:7px; padding:5px 14px; border-radius:20px; background:rgba(255,179,0,0.14); border:1px solid #ffb300; color:#ffb300; font-family:var(--font-tech); font-size:9.5px; font-weight:900; letter-spacing:1.2px; margin-bottom:12px;">
        <i class="fas fa-lock"></i> SECRET CYBER MARKET // BY FOUNDER KAS
      </div>
      <h2 style="font-family:var(--font-tech); font-size:clamp(20px, 4vw, 28px); font-weight:900; color:#fff; margin:0 0 8px 0; letter-spacing:1px;">
        ${escapeHTML(shopConfigData.title || 'КИБЕР-МАРКЕТ CYBER 6 ESPORTS [C6E]')}
      </h2>
      <div style="font-family:var(--font-tech); font-size:11px; color:var(--accent-light); font-weight:800; letter-spacing:1.5px; margin-bottom:14px;">
        ${escapeHTML(shopConfigData.subtitle || 'ЗАКРЫТЫЙ АУКЦИОН И ЭКСКЛЮЗИВНЫЙ ИГРОВОЙ КОНТЕНТ')}
      </div>
      <p style="max-width:640px; margin:0 auto 20px auto; font-size:13px; color:#d4d6dc; line-height:1.65;">
        ${escapeHTML(shopConfigData.hypeText)}
      </p>

      <div style="display:flex; justify-content:center; align-items:center; gap:12px; flex-wrap:wrap;">
        <button type="button" class="boost-btn" style="width:auto; padding:12px 22px; font-size:11px;" onclick="window.joinShopWaitlist()">
          <i class="fas fa-bell"></i> ${isWaiting ? '✅ ВЫ В СПИСКЕ ПЕРВЫХ ПОКУПАТЕЛЕЙ' : 'УВЕДОМИТЬ МЕНЯ ОБ ОТКРЫТИИ ПЕРВЫМ'}
        </button>
        <span style="padding:10px 14px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid var(--glass-border); font-family:var(--font-tech); font-size:10px; color:var(--silver);">
          🔥 Уже ждут открытия: <b style="color:#ffb300;">${waitCount + 24}</b> игроков
        </span>
      </div>
    </div>

    <div class="shop-teaser-grid">
      ${teaserItems.map(item => `
        <div class="shop-teaser-card">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid ${item.color}; color:${item.color}; display:inline-flex; align-items:center; justify-content:center; font-size:16px;">
                <i class="fas ${item.icon}"></i>
              </span>
              <span style="font-family:var(--font-tech); font-size:8.5px; font-weight:800; color:${item.color}; background:rgba(0,0,0,0.5); padding:3px 8px; border-radius:6px; border:1px solid ${item.color};">
                🔒 ${item.badge}
              </span>
            </div>
            <h3 style="font-family:var(--font-tech); font-size:13px; font-weight:800; color:#fff; margin:0 0 8px 0;">
              ${item.title}
            </h3>
            <p style="font-size:11.5px; color:var(--silver-muted); line-height:1.55; margin:0 0 14px 0;">
              ${item.desc}
            </p>
          </div>
          <div style="padding-top:10px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; font-family:var(--font-tech); font-size:9.5px; color:#888;">
            <span>ДОСТУП ПО ПРОФИЛЮ [C6E]</span>
            <span style="color:#ffb300;">СКОРО ➔</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.joinShopWaitlist = async () => {
  if (checkIfCurrentUserBanned()) return;
  try {
    const ref = doc(db, DB_COLLECTION, "shop_config");
    const snap = await getDoc(ref);
    let waitlist = (snap.exists() && Array.isArray(snap.data().waitlist)) ? [...snap.data().waitlist] : [];
    if (waitlist.some(w => w.deviceId === clientSecurityMeta.deviceId)) {
      return window.showNotify("Вы уже записаны в VIP-лист ожидания Магазина [C6E]!", "success");
    }
    waitlist.push({
      deviceId: clientSecurityMeta.deviceId,
      nick: myLocalProfile ? myLocalProfile.nick : 'Гость',
      ts: Date.now()
    });
    await setDoc(ref, { waitlist }, { merge: true });
    addPersonalNotification("🛒 Вы в VIP-списке Магазина [C6E]!", "Как только Основатель Kas откроет продажи, вы получите персональное уведомление.", "success");
    window.showNotify("🔥 Вы добавлены в список ожидания Магазина [C6E]!", "success");
  } catch (e) {}
};

onSnapshot(doc(db, DB_COLLECTION, "shop_config"), (snap) => {
  if (snap.exists()) {
    shopConfigData = { ...shopConfigData, ...snap.data() };
  }
  renderShopSection();
}, () => {
  renderShopSection();
});

// Инициализация UI при старте
updateHeaderProfileChipUI();
setTimeout(autoFillFormsWithProfile, 400);
renderCommunityRadarOnHome();
renderShopSection();



// ============================================================================
// 9. МОДУЛИ v0.6.0: FOCUS STREAK & LEVEL, БАЗА КАРТ [C6E], PICK'EM, РЕАКЦИИ,
//    КОПИРОВАНИЕ КОНФИГОВ БОЙЦОВ, ЗОЛОТЫЕ МЕДАЛИ И СТАТУС НАБОРА В СОСТАВ
// ============================================================================

function triggerHaptic(ms = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch (e) {}
}

function computeUserLevel(prof) {
  if (!prof) return 1;
  const pts = parseInt(prof.activityPts, 10) || 20;
  const streak = parseInt(prof.streakDays, 10) || 1;
  const likes = parseInt(prof.likes, 10) || 0;
  return Math.min(99, Math.max(1, Math.floor((pts + streak * 10 + likes * 5) / 20)));
}

function getProfileMedalsList(prof) {
  if (!prof) return [];
  const medals = [];
  if (hasDeveloperBadge(prof)) {
    medals.push({ icon: 'fa-code', title: '⚡ РАЗРАБОТЧИК [C6E]' });
  }
  if (prof.c6eStatus === 'approved') {
    medals.push({ icon: 'fa-shield-alt', title: '🛡️ ОФИЦИАЛЬНЫЙ БОЕЦ [C6E]' });
  }
  if (Array.isArray(prof.customMedals)) {
    prof.customMedals.forEach(m => medals.push({ icon: 'fa-medal', title: m }));
  }
  const streak = parseInt(prof.streakDays, 10) || 1;
  if (streak >= 3) {
    medals.push({ icon: 'fa-fire', title: `🔥 STREAK ${streak} ДН.` });
  }
  const kdVal = parseFloat(prof.kd || '1.0') || 1.0;
  if (kdVal >= 1.5) {
    medals.push({ icon: 'fa-crosshairs', title: '🎯 HIGH K/D PRO' });
  }
  if ((parseInt(prof.likes, 10) || 0) >= 5) {
    medals.push({ icon: 'fa-heart', title: '👑 ЗВЕЗДА СООБЩЕСТВА' });
  }
  return medals;
}

function renderStreakAndLevelUI() {
  const daysEl = document.getElementById('home-streak-days-val');
  const lvlEl = document.getElementById('home-user-level-pill');
  const btnEl = document.getElementById('home-claim-streak-btn');
  const hubMedalsEl = document.getElementById('hub-profile-medals');

  const todayStr = new Date().toLocaleDateString('ru-RU');
  const streak = (myLocalProfile && parseInt(myLocalProfile.streakDays, 10)) ? parseInt(myLocalProfile.streakDays, 10) : 1;
  const lvl = computeUserLevel(myLocalProfile);
  const claimedToday = myLocalProfile && myLocalProfile.lastStreakDate === todayStr;

  if (daysEl) daysEl.innerText = String(streak);
  if (lvlEl) lvlEl.innerText = `LEVEL ${lvl}`;
  if (btnEl) {
    if (claimedToday) {
      btnEl.innerHTML = `<i class="fas fa-check-circle"></i> СЕГОДНЯ ОТМЕЧЕНО (LVL ${lvl})`;
      btnEl.style.opacity = '0.75';
    } else {
      btnEl.innerHTML = `🔥 ОТМЕТИТЬСЯ (+15 ⚡)`;
      btnEl.style.opacity = '1';
    }
  }

  if (hubMedalsEl && myLocalProfile) {
    const medals = getProfileMedalsList(myLocalProfile);
    hubMedalsEl.innerHTML = `<span class="c6e-medal-chip"><i class="fas fa-layer-group"></i> LEVEL ${lvl}</span>` +
      medals.map(m => `<span class="c6e-medal-chip"><i class="fas ${m.icon}"></i> ${escapeHTML(m.title)}</span>`).join('');
  }
}

window.claimDailyPortalStreak = async () => {
  triggerHaptic(20);
  if (!myLocalProfile || !myLocalProfile.nick) {
    return window.openMyProfileModal(true);
  }
  const todayStr = new Date().toLocaleDateString('ru-RU');
  if (myLocalProfile.lastStreakDate === todayStr) {
    return window.showNotify("🔥 Вы уже забрали ежедневный бонус активности сегодня! Заходите завтра.", "success");
  }

  myLocalProfile.streakDays = (parseInt(myLocalProfile.streakDays, 10) || 1) + 1;
  myLocalProfile.activityPts = (parseInt(myLocalProfile.activityPts, 10) || 20) + 15;
  myLocalProfile.lastStreakDate = todayStr;
  myLocalProfile.lastSeen = Date.now();

  saveLocalProfileCache(myLocalProfile);
  renderStreakAndLevelUI();
  if (typeof window.refreshAppHubProfile === 'function') window.refreshAppHubProfile();
  await syncProfileToAllCloudChannels(myLocalProfile);

  const newLvl = computeUserLevel(myLocalProfile);
  window.showNotify(`🔥 Серия дней: ${myLocalProfile.streakDays}! Начислено +15 ⚡ активности (Ваш уровень: LEVEL ${newLvl})`, "success");
};

// КОПИРОВАНИЕ НАСТРОЕК, СЕНСЫ И ДЕВАЙСА БОЙЦА [C6E] В 1 ТАП
window.copyRosterPlayerConfig = (nick) => {
  triggerHaptic(15);
  const allP = [...mainRosterData, ...reserveRosterData];
  const p = allP.find(x => x.nick === nick);
  if (!p) return;
  const textToCopy = `[C6E] ${p.nick} | Роль: ${p.role || 'Pro'} | Девайс: ${p.device || '120 FPS'} | Сенса: ${p.sens || '2.10'} | Прицел/ID: ${p.crosshair || 'Стандарт [C6E]'}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      window.showNotify(`📋 Настройки бойца [C6E] ${p.nick} скопированы в буфер обмена!`, "success");
    }).catch(() => {
      window.showNotify(`📋 ${textToCopy}`, "success");
    });
  } else {
    window.showNotify(`📋 ${textToCopy}`, "success");
  }
};

// ИНТЕРАКТИВНАЯ ТАКТИЧЕСКАЯ БАЗА КАРТ STANDOFF 2 ОТ СОСТАВА [C6E]
const C6E_MAP_TACTICS_DATA = [
  {
    id: 'dune',
    name: '🏜️ DUNE',
    role: 'Коронная карта [C6E] • Контроль Мида и Ковров',
    callouts: 'Мид (Арка) • Ковры (Апартаменты) • Плент А (Балкон) • Плент B (Туннель)',
    setup: 'Схема 2-1-2 в защите (CT): Снайпер с AWM держит дальний пик Мида под флешку тиммейта на 1:48, два опорника закрывают выход с Ковров на А, два игрока контролируют Туннель B.',
    tip: 'Совет от Kas: На атаке (T) не отдавайте первый фраг на Миду — давайте смок на Хелпу и выходите сплитом через Ковры + Коннектор.'
  },
  {
    id: 'province',
    name: '🏰 PROVINCE',
    role: 'Снайперская доминация • Контроль Апартаментов и Моста',
    callouts: 'Мост • Апартаменты (Ковры) • Конюшня • Руины • Плент А / B',
    setup: 'В защите (CT) 2 снайпера контролируют длинные дистанции на А и выходе из Конюшни, а рифлер с M4A1/AKR играет в упоре под флешку.',
    tip: 'Совет от [C6E]: Быстрый раш B работает только с двумя смоками на КТ-спавн и Арку.'
  },
  {
    id: 'sandstone',
    name: '🕌 SANDSTONE',
    role: 'Классика праков 5v5 • Быстрые ротации через Мид',
    callouts: 'Апартаменты • Мид (Двери) • Балкон А • Тёмка B • КТ-Рампа',
    setup: 'Агрессивный поджим Мида вдвоём на первых секундах раунда даёт полную информацию о перетяжке соперника под А или B.',
    tip: 'Совет от [C6E]: Всегда оставляйте молотов под выход из Апартаментов на 40-й секунде.'
  },
  {
    id: 'rust',
    name: '🏭 RUST',
    role: 'Жёсткий аим-контроль и дуэли на ближней дистанции',
    callouts: 'Ангар • Вент (Труба) • Мид-Контейнеры • Мостик А • Плент B',
    setup: 'Ключ к победе на Rust — контроль Контейнеров на Миду и прострелы Вента. Игрок поддержки обязан кидать анти-пуш молотов в Туннель.',
    tip: 'Совет от [C6E]: В клатчах 1v1 на пленте А играйте от верхнего Мостика и тайминга диффуза.'
  },
  {
    id: 'zone7',
    name: '☢️ ZONE 7',
    role: 'Тактический контроль углов и командный размен',
    callouts: 'Лаборатория • Реактор • Кишка • Плент А • Склад B',
    setup: 'Плотная игра парами (Entry + Размен): никогда не пикайте длинный коридор по одному без моментальной ответной флешки.',
    tip: 'Совет от [C6E]: Контроль центра карты позволяет сменить вектор атаки за 8 секунд до конца раунда.'
  }
];

let activeTacticalMapId = 'dune';
window.selectTacticalMap = (mapId) => {
  triggerHaptic(10);
  activeTacticalMapId = mapId;
  renderTacticalMapGuide();
};

function renderTacticalMapGuide() {
  const tabsEl = document.getElementById('c6e-map-tactics-tabs');
  const boxEl = document.getElementById('c6e-map-tactics-content');
  if (!tabsEl || !boxEl) return;

  tabsEl.innerHTML = C6E_MAP_TACTICS_DATA.map(m => `
    <button type="button" class="map-tac-btn ${m.id === activeTacticalMapId ? 'active' : ''}" onclick="window.selectTacticalMap('${m.id}')">
      ${m.name}
    </button>
  `).join('');

  const cur = C6E_MAP_TACTICS_DATA.find(m => m.id === activeTacticalMapId) || C6E_MAP_TACTICS_DATA[0];
  boxEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
      <span style="font-family:var(--font-tech); font-size:12px; font-weight:900; color:#f5b041;">${cur.name}</span>
      <span style="font-size:10px; color:var(--silver); font-weight:700;">${cur.role}</span>
    </div>
    <div style="font-size:11px; color:var(--silver-muted); margin-bottom:6px;">
      <b style="color:#fff;">📍 Ключевые позиции:</b> ${cur.callouts}
    </div>
    <div style="font-size:11.5px; color:#ddd; line-height:1.5; margin-bottom:8px;">
      <b style="color:#f5b041;">🛡️ Схема [C6E]:</b> ${cur.setup}
    </div>
    <div style="font-size:11px; color:var(--silver); background:rgba(245,176,65,0.08); border:1px solid rgba(245,176,65,0.25); padding:8px 10px; border-radius:8px;">
      💡 <i>${cur.tip}</i>
    </div>
  `;
}

// СИСТЕМА PICK'EM (ПРОГНОЗЫ НА МАТЧ В MATCH CENTER) И БЫСТРЫЕ РЕАКЦИИ ПОД ПОСТАМИ
let globalReactionsMap = {};
let globalPickemVotes = { win20: 14, clutch: 6, mvp: 9 };

function renderHomePickemWidget() {
  const box = document.getElementById('home-pickem-box');
  if (!box) return;
  const myVote = localStorage.getItem('c6e_my_pickem_vote') || '';
  const w20 = parseInt(globalPickemVotes.win20, 10) || 14;
  const cl = parseInt(globalPickemVotes.clutch, 10) || 6;
  const mvp = parseInt(globalPickemVotes.mvp, 10) || 9;
  const total = Math.max(1, w20 + cl + mvp);

  box.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
      <span style="font-family:var(--font-tech); font-size:9.5px; font-weight:800; color:#f5b041;">
        🎯 PICK'EM ПРОГНОЗ СООБЩЕСТВА НА МАТЧ [C6E] (+5 ⚡ В ПРОФИЛЬ)
      </span>
      <span style="font-size:9.5px; color:var(--silver-muted);">Проголосовало: <b style="color:#fff;">${total}</b></span>
    </div>
    <div class="pickem-grid">
      <button type="button" class="pickem-option-btn ${myVote === 'win20' ? 'voted' : ''}" onclick="window.voteMatchPickem('win20')">
        <span>🏆 Сухая победа [C6E]</span>
        <b>${Math.round((w20 / total) * 100)}%</b>
      </button>
      <button type="button" class="pickem-option-btn ${myVote === 'clutch' ? 'voted' : ''}" onclick="window.voteMatchPickem('clutch')">
        <span>🔥 Победа в клатче</span>
        <b>${Math.round((cl / total) * 100)}%</b>
      </button>
      <button type="button" class="pickem-option-btn ${myVote === 'mvp' ? 'voted' : ''}" onclick="window.voteMatchPickem('mvp')">
        <span>👑 Тотальная доминация</span>
        <b>${Math.round((mvp / total) * 100)}%</b>
      </button>
    </div>
  `;
}

window.voteMatchPickem = async (choiceKey) => {
  triggerHaptic(15);
  if (localStorage.getItem('c6e_my_pickem_vote')) {
    return window.showNotify("🎯 Ваш прогноз Pick'Em уже учтён!", "success");
  }
  localStorage.setItem('c6e_my_pickem_vote', choiceKey);
  globalPickemVotes[choiceKey] = (parseInt(globalPickemVotes[choiceKey], 10) || 5) + 1;
  renderHomePickemWidget();

  if (myLocalProfile && myLocalProfile.nick) {
    myLocalProfile.activityPts = (parseInt(myLocalProfile.activityPts, 10) || 20) + 5;
    saveLocalProfileCache(myLocalProfile);
    renderStreakAndLevelUI();
    syncProfileToAllCloudChannels(myLocalProfile).catch(() => {});
  }
  try {
    await updateDoc(doc(db, DB_COLLECTION, "reviews"), { c6e_pickem: globalPickemVotes });
  } catch (e) {}
  window.showNotify("🎯 Прогноз принят! +5 ⚡ очков активности начислено в ваш профиль.", "success");
};

window.renderPostReactionsHTML = (itemKey) => {
  const counts = globalReactionsMap[itemKey] || { fire: 7, crown: 4, heart: 5, bolt: 3 };
  const myReact = localStorage.getItem('c6e_react_' + itemKey) || '';
  const emojis = [
    { k: 'fire', icon: '🔥', val: counts.fire || 7 },
    { k: 'crown', icon: '👑', val: counts.crown || 4 },
    { k: 'heart', icon: '❤️', val: counts.heart || 5 },
    { k: 'bolt', icon: '⚡', val: counts.bolt || 3 }
  ];
  return `
    <div class="c6e-reactions-bar" onclick="event.stopPropagation();">
      ${emojis.map(em => `
        <button type="button" class="react-pill-btn ${myReact === em.k ? 'reacted' : ''}" onclick="window.reactToPost('${escapeHTML(itemKey)}', '${em.k}')">
          <span>${em.icon}</span> <span>${em.val}</span>
        </button>
      `).join('')}
    </div>
  `;
};

window.reactToPost = async (itemKey, emojiKey) => {
  triggerHaptic(10);
  const storeKey = 'c6e_react_' + itemKey;
  if (localStorage.getItem(storeKey)) {
    return window.showNotify("Вы уже поставили реакцию на эту запись!", "success");
  }
  localStorage.setItem(storeKey, emojiKey);
  if (!globalReactionsMap[itemKey]) {
    globalReactionsMap[itemKey] = { fire: 7, crown: 4, heart: 5, bolt: 3 };
  }
  globalReactionsMap[itemKey][emojiKey] = (parseInt(globalReactionsMap[itemKey][emojiKey], 10) || 3) + 1;
  renderPublicNewsFeeds();
  try {
    await updateDoc(doc(db, DB_COLLECTION, "reviews"), { c6e_reactions: globalReactionsMap });
  } catch (e) {}
};

// Подписка на реакции, Pick'Em и статус набора из документа reviews / about
onSnapshot(doc(db, DB_COLLECTION, "reviews"), (snap) => {
  if (!snap.exists()) return;
  const d = snap.data();
  if (d.c6e_pickem) {
    globalPickemVotes = { ...globalPickemVotes, ...d.c6e_pickem };
    renderHomePickemWidget();
  }
  if (d.c6e_reactions) {
    globalReactionsMap = { ...globalReactionsMap, ...d.c6e_reactions };
    renderPublicNewsFeeds();
  }
  if (d.c6e_recruitment) {
    renderRecruitmentStatusGrid(d.c6e_recruitment);
  }
});

function renderRecruitmentStatusGrid(recData) {
  const grid = document.getElementById('join-roles-status-grid');
  if (!grid || !recData) return;
  const roles = [
    { key: 'sniper', label: '🎯 Sniper' },
    { key: 'igl', label: '🧠 IGL / Капитан' },
    { key: 'entry', label: '💥 Entry Fragger' },
    { key: 'support', label: '🛡️ Support' }
  ];
  grid.innerHTML = roles.map(r => {
    const isOpen = recData[r.key] !== false;
    return `
      <div style="padding:8px 10px; border-radius:10px; background:rgba(255,255,255,0.03); border:1px solid ${isOpen ? 'rgba(245,176,65,0.35)' : 'rgba(255,255,255,0.08)'}; font-size:11px; display:flex; justify-content:space-between;">
        <span>${r.label}</span>
        <b style="color:${isOpen ? '#f5b041' : '#777'}; font-family:var(--font-tech); font-size:9.5px;">${isOpen ? 'ОТКРЫТО' : 'ЗАКРЫТО'}</b>
      </div>
    `;
  }).join('');
}

// Запускаем инициализацию модулей v0.6.0
renderStreakAndLevelUI();
renderTacticalMapGuide();
renderHomePickemWidget();

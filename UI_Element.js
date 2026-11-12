/* =====================================================
   UI_ELEMENT.JS
   Yahan saara HTML UI (Menu, Popups, Buttons) handle hota hai.
   Isme Game Logic nahi hai, sirf Visuals aur Click Sounds hain.
===================================================== */

window.GameUI = {

    /* --- 1. PRELOAD SOUNDS   --- */
    preloadSounds: function (scene) {
        scene.load.audio('s_rotate', 'assets/sounds/rotate.mp3');
        scene.load.audio('s_death', 'assets/sounds/death.mp3');
        scene.load.audio('s_win', 'assets/sounds/win.mp3');
        scene.load.audio('s_click', 'assets/sounds/click.mp3');
        scene.load.audio('s_jump', 'assets/sounds/jump.mp3');
        scene.load.audio('s_break', 'assets/sounds/break.mp3');
    },

    /* --- 2. CREATE ANIMATIONS   --- */
    createAnimations: function (scene) {
        scene.anims.create({ key: 'run', frames: [{ key: 'playerRun', frame: 0 }, { key: 'playerJump', frame: 1 }], frameRate: 8, repeat: -1 });
        scene.anims.create({ key: 'idle', frames: [{ key: 'playerRun', frame: 0 }] });
        scene.anims.create({ key: 'jump', frames: [{ key: 'playerJump', frame: 0 }] });
    },

    /* --- 3. CREATE BORDERS   --- */
    createBorders: function (scene) {
        const walls = scene.physics.add.staticGroup();
        const createWall = (x, y, w, h) => {
            const g = scene.add.graphics();
            g.setDepth(5);
            g.fillStyle(THEME.wallDark); g.fillRect(x - w / 2, y - h / 2, w, h);
            g.fillStyle(THEME.wallLight); g.fillRect(x - w / 2, y - h / 2, w, 3);
            g.fillStyle(THEME.wallShadow); g.fillRect(x - w / 2, y + h / 2 - 3, w, 3);
            const body = scene.add.rectangle(x, y, w, h, 0x000000, 0);
            scene.physics.add.existing(body, true);
            return body;
        };
        walls.add(createWall(300, 590, 600, 20));
        walls.add(createWall(300, 10, 600, 20));
        walls.add(createWall(10, 300, 20, 600));
        walls.add(createWall(590, 300, 20, 600));
        return walls;
    },

    /* --- 4. POPUP UI (Win / Death) --- */
    showPopup: function ({ title, primaryText, onHome, onPrimary, type }) {
        document.getElementById('popup-overlay')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:10000;animation:fadeIn 0.25s ease';

        const emoji = type === 'death' ? '☠️' : (type === 'victory' ? '🏆' : '🥳');
        const box = document.createElement('div');
        box.style.cssText = 'width:320px;max-width:90vw;background:linear-gradient(180deg, #1e1e1e, #121212);border-radius:22px;padding:26px 22px 24px;text-align:center;color:#fff;box-shadow:0 20px 40px rgba(0,0,0,0.5);animation:popIn 0.25s ease';

        box.innerHTML = `
            <div style="font-size:64px;margin-bottom:10px">${emoji}</div>
            <div style="font-size:18px;font-weight:600;margin-bottom:22px">${title}</div>
            <div style="display:flex;gap:14px">
                <button id="popupHome" style="flex:1;height:48px;border-radius:14px;border:none;background:#2a2a2a;color:#bbb;font-size:15px;font-weight:600;">Home</button>
                <button id="popupPrimary" style="flex:1;height:48px;border-radius:14px;border:none;background:linear-gradient(145deg,#ffd54a,#ffb300);color:#000;font-size:15px;font-weight:600;">${primaryText}</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('popupHome').onclick = () => { overlay.remove(); onHome && onHome(); };
        document.getElementById('popupPrimary').onclick = () => { overlay.remove(); onPrimary && onPrimary(); };

        if (!document.getElementById('popup-anim-style')) {
            const s = document.createElement('style');
            s.id = 'popup-anim-style';
            s.innerHTML = `@keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } button:active { transform: scale(0.96); }`;
            document.head.appendChild(s);
        }
    },

    /* --- 5. PAUSE POPUP --- */
    showPausePopup: function (scene) {
        if (document.getElementById('pause-overlay')) return;
        const overlay = document.createElement('div'); overlay.id = 'pause-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:10001;animation:fadeIn 0.2s';
        const box = document.createElement('div');
        box.style.cssText = 'width:280px;background:#222;border-radius:16px;padding:24px;text-align:center;border:1px solid #444;display:flex;flex-direction:column;gap:12px;';
        box.innerHTML = `<div style="color:white;font-size:22px;font-weight:bold;margin-bottom:10px;">Paused</div><button id="pResume" class="pause-btn" style="background:gold;color:black;">Resume</button><button id="pRestart" class="pause-btn" style="background:#444;color:white;">Restart</button><button id="pHome" class="pause-btn" style="background:#444;color:white;">Home</button>`;
        const style = document.createElement('style'); style.innerHTML = `.pause-btn{padding:12px;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;}.pause-btn:active{transform:scale(0.96);}`;
        overlay.appendChild(style); overlay.appendChild(box); document.body.appendChild(overlay);

        document.getElementById('pResume').onclick = () => {
            scene.sound.play('s_click'); overlay.remove(); scene.physics.resume();
        };
        document.getElementById('pRestart').onclick = () => {
            scene.sound.play('s_click'); overlay.remove(); scene.physics.resume();
            if (window.resetLevel) window.resetLevel(scene);
        };
        document.getElementById('pHome').onclick = () => {
            scene.sound.play('s_click'); location.reload();
        };
    },

    /* --- 6. CONTROLS UI --- */
    createControlsUI: function (level, isBoss) {
        if (document.getElementById('controls-root')) return;

        if (window.helpPanelDismissed === undefined) {
            window.helpPanelDismissed = true; // Closed by default; click Controls or press H to open
        }

        const titleColor = isBoss ? '#ff3333' : 'white';
        if (!document.getElementById('controls-ui-style')) {
            const style = document.createElement('style');
            style.id = 'controls-ui-style';
            style.innerHTML = `
                :root {
                    --btn-size: clamp(48px, 12vh, 65px);
                    --btn-font: clamp(20px, 4.5vh, 26px);
                    --zone-bottom: clamp(70px, 4vh, 45px);
                    --zone-side: clamp(24px, 5.5vw, 60px);
                    --dpad-gap: clamp(6px, 1.4vh, 10px);
                }

                .controls { position: fixed; inset: 0; pointer-events: none; z-index: 9999; font-family: sans-serif; }
                .top-bar { position: absolute; top: clamp(10px, 2.5vh, 20px); left: clamp(12px, 3vw, 20px); right: clamp(12px, 3vw, 20px); display: flex; justify-content: space-between; align-items: center; pointer-events: auto; }
                .menu-btn { font-size: clamp(24px, 5vh, 32px); font-weight: normal; cursor: pointer; color: white; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8)); transition: transform 0.1s; user-select: none; }
                .menu-btn:active { transform: scale(0.9); }
                .level-title { color: ${titleColor}; font-size: clamp(18px, 4vh, 24px); font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.8); position: absolute; left: 50%; transform: translateX(-50%); pointer-events: none; user-select: none; }
                
                .left-zone {
                    position: absolute;
                    bottom: calc(var(--zone-bottom) + env(safe-area-inset-bottom, 0px));
                    left: calc(var(--zone-side) + env(safe-area-inset-left, 16px));
                    display: flex;
                    gap: clamp(10px, 2.5vw, 18px);
                    pointer-events: auto;
                    touch-action: none;
                }

                .right-zone {
                    position: absolute;
                    bottom: calc(var(--zone-bottom) + env(safe-area-inset-bottom, 0px));
                    right: calc(var(--zone-side) + env(safe-area-inset-right, 16px));
                    display: grid;
                    grid-template-columns: repeat(3, var(--btn-size));
                    grid-template-rows: repeat(2, var(--btn-size));
                    column-gap: clamp(8px, 1.8vw, 12px);
                    row-gap: clamp(16px, 3.5vh, 22px);
                    pointer-events: auto;
                    touch-action: none;
                }

                .btn {
                    position: relative;
                    width: var(--btn-size);
                    height: var(--btn-size);
                    border-radius: clamp(8px, 2vh, 12px);
                    background: rgba(255,255,255,0.12);
                    border: 2px solid gold;
                    color: gold;
                    font-size: var(--btn-font);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    -webkit-user-select: none;
                    -webkit-touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: none;
                    transition: 0.12s ease;
                    cursor: pointer;
                }
                .btn * {
                    pointer-events: none;
                }

                .btn:active, .btn.key-active { transform: scale(0.92) !important; background: rgba(255, 215, 0, 0.35) !important; border-color: #fff !important; color: #fff !important; box-shadow: 0 0 16px rgba(255, 215, 0, 0.85), inset 0 0 10px rgba(255, 215, 0, 0.5) !important; }
                .rotate-btn { border-radius: 50%; border-color: gold; color: gold; }
                #btnUp { grid-column: 2; grid-row: 1; }
                #btnLeft { grid-column: 1; grid-row: 2; }
                #btnDown { grid-column: 2; grid-row: 2; }
                #btnRight { grid-column: 3; grid-row: 2; }
                .btn-disabled { border-color: #777 !important; color: #777 !important; background: rgba(255,255,255,0.05) !important; box-shadow: none !important; pointer-events: none; opacity: 0.45; }
                .btn-disabled.rotate-btn { border-color: #777 !important; color: #777 !important; }
                .btn-disabled .key-badge, .btn-disabled .key-badge-sub { opacity: 0.35 !important; border-color: #666 !important; color: #888 !important; }

                /* Emulator Key Badges on Buttons (Always visible across all devices) */
                .key-badge {
                    display: flex;
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    min-width: 19px;
                    height: 19px;
                    box-sizing: border-box;
                    background: linear-gradient(180deg, #2c2c2c, #161616);
                    color: #ffd700;
                    font-size: 11px;
                    font-weight: 800;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                    padding: 2px 5px;
                    border-radius: 6px;
                    border: 1.5px solid rgba(255, 215, 0, 0.85);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    pointer-events: none;
                    line-height: 1;
                    z-index: 10;
                    text-transform: uppercase;
                    align-items: center;
                    justify-content: center;
                    letter-spacing: 0.5px;
                    transition: all 0.1s ease;
                }

                .key-badge-sub {
                    display: flex;
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(180deg, #2c2c2c, #161616);
                    color: #ffd700;
                    font-size: 8.5px;
                    font-weight: 800;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                    padding: 2px 5px;
                    border-radius: 5px;
                    border: 1.5px solid rgba(255, 215, 0, 0.85);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    pointer-events: none;
                    line-height: 1;
                    z-index: 10;
                    letter-spacing: 0.8px;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.1s ease;
                }

                .btn.key-active .key-badge {
                    background: #ffd700 !important;
                    color: #111 !important;
                    border-color: #fff !important;
                    transform: scale(1.1);
                }
                .btn.key-active .key-badge-sub {
                    background: #ffd700 !important;
                    color: #111 !important;
                    border-color: #fff !important;
                    transform: translateX(-50%) scale(1.1) !important;
                }

                /* Top-Right Controls Help Button & Panel */
                .help-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(28, 28, 28, 0.85);
                    border: 1.5px solid rgba(255, 215, 0, 0.6);
                    color: #ffd700;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 6px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    backdrop-filter: blur(6px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                    transition: all 0.2s ease;
                    user-select: none;
                }
                .help-btn:hover {
                    background: rgba(45, 45, 45, 0.95);
                    border-color: #fff;
                    color: #fff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.35);
                }
                .help-btn:active {
                    transform: scale(0.95);
                }

                .controls-help-panel {
                    position: absolute;
                    top: 64px;
                    right: 20px;
                    width: 250px;
                    max-width: calc(100vw - 40px);
                    background: linear-gradient(150deg, rgba(30, 30, 30, 0.96), rgba(15, 15, 15, 0.96));
                    border: 1.5px solid rgba(255, 215, 0, 0.5);
                    border-radius: 16px;
                    padding: 14px 16px;
                    color: #fff;
                    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.75), 0 0 15px rgba(255, 215, 0, 0.12);
                    backdrop-filter: blur(10px);
                    pointer-events: auto;
                    z-index: 10002;
                    transition: opacity 0.22s ease, transform 0.22s ease;
                    transform-origin: top right;
                }
                .controls-help-panel.collapsed {
                    opacity: 0;
                    pointer-events: none;
                    transform: scale(0.92) translateY(-10px);
                }
                .help-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                    padding-bottom: 8px;
                    margin-bottom: 10px;
                }
                .help-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #ffd700;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .help-close-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    font-size: 16px;
                    cursor: pointer;
                    line-height: 1;
                    padding: 2px 6px;
                    border-radius: 4px;
                    transition: all 0.15s;
                }
                .help-close-btn:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.12);
                }
                .help-rows {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .help-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                }
                .help-action {
                    color: #ddd;
                    font-weight: 500;
                }
                .help-keys {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                .help-key {
                    background: linear-gradient(180deg, #303030, #202020);
                    border: 1px solid #555;
                    border-bottom: 2px solid #111;
                    color: #ffd700;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 2px 6px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.5);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                }
                .help-sep {
                    color: #777;
                    font-size: 11px;
                    margin: 0 2px;
                }
                .help-footer {
                    font-size: 10px;
                    color: #888;
                    margin-top: 10px;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    padding-top: 7px;
                    text-align: center;
                }
            `;
            document.head.appendChild(style);
        }

        const root = document.createElement('div');
        root.id = 'controls-root'; root.className = 'controls';
        root.innerHTML = `
            <div class="top-bar">
                <div class="menu-btn" id="btnMenu" title="Pause Game (Esc / P)">❚❚</div>
                <div class="level-title">Level ${level}</div>
                <div class="help-btn" id="btnHelp" title="Keyboard Controls Help (H)">
                    <span style="font-size: 15px;">⌨️</span>
                    <span>Controls</span>
                </div>
            </div>

            <div class="controls-help-panel ${window.helpPanelDismissed ? 'collapsed' : ''}" id="controlsHelpPanel">
                <div class="help-header">
                    <span class="help-title">⌨️ Keyboard Controls</span>
                    <button class="help-close-btn" id="btnCloseHelp" title="Close (H)">✕</button>
                </div>
                <div class="help-rows">
                    <div class="help-row">
                        <span class="help-action">Move</span>
                        <div class="help-keys">
                            <span class="help-key">A</span>
                            <span class="help-key">D</span>
                            <span class="help-sep">/</span>
                            <span class="help-key">←</span>
                            <span class="help-key">→</span>
                        </div>
                    </div>
                    <div class="help-row">
                        <span class="help-action">Jump</span>
                        <div class="help-keys">
                            <span class="help-key">Space</span>
                            <span class="help-sep">/</span>
                            <span class="help-key">W</span>
                            <span class="help-sep">/</span>
                            <span class="help-key">↑</span>
                        </div>
                    </div>
                    <div class="help-row">
                        <span class="help-action">Rotate</span>
                        <div class="help-keys">
                            <span class="help-key">Q</span>
                            <span class="help-key">E</span>
                        </div>
                    </div>
                    <div class="help-row">
                        <span class="help-action">Enter / Down</span>
                        <div class="help-keys">
                            <span class="help-key">S</span>
                            <span class="help-key">↵ Enter</span>
                            <span class="help-sep">/</span>
                            <span class="help-key">↓</span>
                        </div>
                    </div>
                    <div class="help-row">
                        <span class="help-action">Pause</span>
                        <div class="help-keys">
                            <span class="help-key">Esc</span>
                            <span class="help-sep">/</span>
                            <span class="help-key">P</span>
                        </div>
                    </div>
                </div>
                <div class="help-footer">
                    Press <span class="help-key" style="font-size: 9px; padding: 1px 4px;">H</span> to toggle help
                </div>
            </div>

            <div class="left-zone">
                <div class="btn rotate-btn" id="btnAntiClock" title="Rotate Left (Q)">
                    <span>↺</span>
                    <span class="key-badge">Q</span>
                </div>
                <div class="btn rotate-btn" id="btnClock" title="Rotate Right (E)">
                    <span>↻</span>
                    <span class="key-badge">E</span>
                </div>
            </div>

            <div class="right-zone">
                <div class="btn" id="btnUp" title="Jump (W / ↑ / Space)">
                    <span>↑</span>
                    <span class="key-badge">W</span>
                    <span class="key-badge-sub">SPACE</span>
                </div>
                <div class="btn" id="btnLeft" title="Move Left (A / ←)">
                    <span>←</span>
                    <span class="key-badge">A</span>
                </div>
                <div class="btn" id="btnDown" title="Enter Door / Press Button (S / ↓ / Enter)">
                    <span>↓</span>
                    <span class="key-badge">S</span>
                    <span class="key-badge-sub">ENTER</span>
                </div>
                <div class="btn" id="btnRight" title="Move Right (D / →)">
                    <span>→</span>
                    <span class="key-badge">D</span>
                </div>
            </div>
        `;
        document.body.appendChild(root);

        const btnHelp = root.querySelector('#btnHelp');
        const helpPanel = root.querySelector('#controlsHelpPanel');
        const btnCloseHelp = root.querySelector('#btnCloseHelp');

        if (btnHelp && helpPanel) {
            btnHelp.onclick = (e) => {
                e.stopPropagation();
                helpPanel.classList.toggle('collapsed');
                window.helpPanelDismissed = helpPanel.classList.contains('collapsed');
            };
        }
        if (btnCloseHelp && helpPanel) {
            btnCloseHelp.onclick = (e) => {
                e.stopPropagation();
                helpPanel.classList.add('collapsed');
                window.helpPanelDismissed = true;
            };
        }

        setTimeout(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) { canvas.style.position = 'absolute'; canvas.style.zIndex = '1'; }
        }, 0);
    },

    /* --- 7. BUTTON VISUALS --- */
    updateButtonVisuals: function (grounded) {
        const ids = ['btnClock', 'btnAntiClock', 'btnDown'];
        ids.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) { grounded ? btn.classList.remove('btn-disabled') : btn.classList.add('btn-disabled'); }
        });
    }
};

/* --- 8. MAIN MENU (Game Start Screen) --- */
(function () {
    // ✅ FIX 1: Sound ko pehle hi load karke rakho
    const clickSound = new Audio('assets/sounds/click.mp3');
    clickSound.preload = 'auto'; // Browser ko bolo isse ready rakhe

    const style = document.createElement('style');
    style.innerHTML = `
        body { margin: 0; width: 100vw; height: 100vh; background: radial-gradient(circle at top, #222, #000); display: flex; align-items: center; justify-content: center; }
        #ui-root { position: fixed; inset: 0; background: radial-gradient(circle at top, #222, #000); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .menu { width: 360px; max-width: 90vw; text-align: center; }
        .title { font-size: 32px; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; color: #fff; }
        .subtitle { opacity: 0.7; margin-bottom: 30px; font-size: 14px; color: #ccc; }
        .level-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .level-btn { aspect-ratio: 1; border-radius: 14px; background: linear-gradient(145deg, #2a2a2a, #111); border: 2px solid #444; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 600; cursor: pointer; user-select: none; transition: 0.15s ease; color: #fff; }
        .level-btn:active { transform: scale(0.95); }
        .level-btn.unlocked { border-color: gold; color: gold; box-shadow: 0 0 10px rgba(255, 215, 0, 0.25); }
        .level-btn.boss-level { border-color: #ff3333 !important; color: #ff3333 !important; box-shadow: 0 0 10px rgba(255, 51, 51, 0.4) !important; }
        .level-btn.locked { opacity: 0.35; cursor: default; }
        .locked span { font-size: 20px; }
        .footer { margin-top: 30px; font-size: 12px; opacity: 0.5; color: #fff; }
    `;
    document.head.appendChild(style);

    const uiRoot = document.createElement('div');
    uiRoot.id = 'ui-root';
    const menu = document.createElement('div');
    menu.className = 'menu';

    menu.innerHTML = `
        <div class="title">DEVIL ROTATE</div>
        <div class="subtitle">Gravity is not your friend</div>
        <div class="level-grid"></div>
        <div class="footer">Tap unlocked level to start</div>
    `;

    const grid = menu.querySelector('.level-grid');
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('div');

        // --- UNLOCKED LEVELS ---
        if (i <= GameProgress.unlockedLevel) {
            btn.className = 'level-btn unlocked';
            btn.textContent = i;
            if (i % 5 === 0) btn.classList.add('boss-level');

            btn.addEventListener('click', () => {
                // ✅ FIX 2: Instant Play + Thoda Delay before game start
                clickSound.currentTime = 0; // Agar bar-bar dabaye to shuru se baje
                clickSound.play().catch(e => console.log(e));

                // 200ms ka wait taaki awaaz sunai de, fir UI hatao
                setTimeout(() => {
                    destroyUI();
                    window.startGame(i);
                }, 200);
            });
        }
        // --- LOCKED LEVELS ---
        else {
            btn.className = 'level-btn locked';
            btn.innerHTML = '<span>🔒</span>';
        }
        grid.appendChild(btn);
    }
    uiRoot.appendChild(menu);
    const mountUI = () => document.body.appendChild(uiRoot);
    if (document.body) mountUI();
    else window.addEventListener('DOMContentLoaded', mountUI);

    function destroyUI() { uiRoot.remove(); style.remove(); }
})();
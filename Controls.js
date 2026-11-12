/* =====================================================
   CONTROLS.JS
   Main Logic (Backend). 
   - Preload calls GameItems (Items) & GameUI (Sounds)
   - Create calls GameItems (Player) & GameUI (Borders)
   - Updates Logic, Physics, Sound Triggers
===================================================== */

let sceneRef;
let player, goal;

let rotationAngle = 0;
let isRotating = false;

let moveLeft = false;
let moveRight = false;
let doJump = false;
let tryEnter = false;

let isGrounded = false;
let currentLevel = 1;

// Global settings
let playerSpeed = 200;
let playerJumpForce = 300;

function isBossLevel(level) { return level % 5 === 0; }

window.startLevel = function(levelNumber) {
    currentLevel = levelNumber;
    rotationAngle = 0;
    isRotating = false;
    resetInputState();
    document.getElementById('controls-root')?.remove(); 
    document.getElementById('pause-overlay')?.remove();

    if (game.scene.getScene('GameScene')) {
        game.scene.stop('GameScene');
        game.scene.remove('GameScene');
    }

    const GameScene = new Phaser.Scene('GameScene');
    GameScene.preload = preload;
    GameScene.create  = create;
    GameScene.update  = update;
    game.scene.add('GameScene', GameScene, true);
};

/* =====================================================
   PRELOAD (Calls GameItems & GameUI)
===================================================== */
function preload() {
    // 1. Items Preload (Images) -> Game_Item.js
    GameItems.preloadItems(this);

    // 2. Sounds Preload -> UI_Element.js
    GameUI.preloadSounds(this);
}

/* =====================================================
   CREATE (Calls UI & Items)
===================================================== */
function create() {
    sceneRef = this;
    
    // 1. Create Borders (From UI_Element.js as requested)
    const borders = GameUI.createBorders(this); 
    
    const data = window.LEVELS[currentLevel];
    // 2. Create Level Items (From Game_Item.js)
    const settings = GameItems.createLevel(this, data);
    
    playerSpeed = settings.speed;
    playerJumpForce = settings.jump;
    goal = settings.goal;

    // 3. Create Player (From Game_Item.js)
    player = GameItems.createPlayer(this, settings.start.x, settings.start.y);
    updatePlayerHitbox();

    /* --- LOGIC & COLLISIONS --- */
    
    // Walls
    this.physics.add.collider(player, GameItems.groups.platforms);
    this.physics.add.collider(player, borders);

    // Breakable Blocks
    this.physics.add.collider(player, GameItems.groups.temp, (p, b) => {
        if (!b.getData('breaking')) {
            b.setData('breaking', true);
            
            // --- FIX 1: setTint hataya, FillStyle lagaya ---
            // Invisible physics body ko Laal (Red) aur Visible kar diya
            b.setFillStyle(0xff0000); 
            b.setAlpha(1); 
            // -----------------------------------------------

            sceneRef.sound.play('s_break'); 
            
            // Troll Game Logic: Fast break (200ms)
            sceneRef.time.delayedCall(200, () => {
                // --- FIX 2: Graphics bhi destroy karo ---
                if (b.getData('visuals')) {
                    b.getData('visuals').destroy();
                }
                b.destroy();
                // ----------------------------------------
            });
        }
    });

    // Troll Blocks
    this.physics.add.collider(player, GameItems.groups.trollBlocks, (p, b) => {
        if (b.alpha === 0) {
            sceneRef.tweens.add({ targets: b, alpha: 1, duration: 200, ease: 'Bounce.out' });
            sceneRef.sound.play('s_break'); 
        }
    });

    // Death Logic
    const killPlayer = () => {
        this.physics.pause(); 
        resetInputState();
        sceneRef.sound.play('s_death'); 
        GameUI.showPopup({ 
            type: 'death', title: 'You Died!', primaryText: 'Restart', 
            onPrimary: () => { 
                sceneRef.sound.play('s_click'); 
                resetInputState(); this.physics.resume(); resetLevel(this); 
            }, 
            onHome: () => {
                sceneRef.sound.play('s_click'); 
                location.reload(); 
            } 
        });
    };
    
    // Fake doors = instant death if active/visible
    this.physics.add.overlap(player, GameItems.groups.fakeDoors, (p, d) => {
        if (!d.getData('hidden')) {
            killPlayer();
        }
    });

    // Initial fake goal in Level 10 kills on touch
    if (goal) {
        this.physics.add.overlap(player, goal, () => {
            if (goal.getData('isFakeInitially')) {
                killPlayer();
            }
        });
    }

    this.physics.add.collider(player, GameItems.groups.spikes, killPlayer);
    
    this.physics.add.collider(player, GameItems.groups.sudden, (p, s) => {
        if (s.alpha > 0 && s.getData('type') === 'spike') killPlayer();
    });

    // Button Logic
    this.physics.add.overlap(player, GameItems.groups.buttons, (p, btn) => {
        if (tryEnter && !btn.getData('isPressed')) {
            btn.setData('isPressed', true); 
            btn.setFrame(1); 
            sceneRef.sound.play('s_click'); 
            sceneRef.tweens.add({ targets: btn, scaleY: btn.scaleY * 0.8, duration: 100, yoyo: true });

            if (currentLevel === 9) {
                // LEVEL 9: Reveal real door permanently (no timer, no popup, alpha stays 1!)
                if (goal) {
                    goal.setData('unlocked', true);
                    goal.setData('hidden', false);
                    goal.body.checkCollision.none = false;
                    goal.setAlpha(1);
                    sceneRef.sound.play('s_win');
                    sceneRef.tweens.add({
                        targets: goal,
                        scaleX: goal.scaleX * 1.3,
                        scaleY: goal.scaleY * 1.3,
                        duration: 150,
                        yoyo: true,
                        ease: 'Back.easeOut',
                        onComplete: () => { goal.setAlpha(1); }
                    });
                }
            } else if (currentLevel === 10) {
                // LEVEL 10:
                // 1. Gate 1 (first gate) stops being fake, becomes the REAL winning exit!
                if (goal) {
                    goal.setData('isFakeInitially', false);
                    goal.setData('unlocked', true);
                    goal.setData('hidden', false);
                    goal.setAlpha(1);
                    goal.body.checkCollision.none = false;
                }

                // 2. New Fake Door (Gate 2 / baitDoor) appears permanently to bait the player!
                const baitDoor = GameItems.groups.fakeDoors.getChildren().find(d => d.getData('id') === 'baitDoor');
                if (baitDoor) {
                    baitDoor.setData('hidden', false);
                    baitDoor.body.checkCollision.none = false;
                    baitDoor.setAlpha(1);
                    sceneRef.sound.play('s_win');
                    sceneRef.tweens.add({
                        targets: baitDoor,
                        scaleX: baitDoor.scaleX * 1.3,
                        scaleY: baitDoor.scaleY * 1.3,
                        duration: 150,
                        yoyo: true,
                        ease: 'Back.easeOut',
                        onComplete: () => { baitDoor.setAlpha(1); }
                    });
                }
            } else {
                // Generic unlock for any other level
                if (goal && goal.getData('hidden')) {
                    goal.setData('hidden', false);
                    goal.body.checkCollision.none = false;
                    goal.setAlpha(1);
                    sceneRef.sound.play('s_win');
                    sceneRef.tweens.add({
                        targets: goal,
                        scaleX: goal.scaleX * 1.3,
                        scaleY: goal.scaleY * 1.3,
                        duration: 150,
                        yoyo: true,
                        ease: 'Back.easeOut',
                        onComplete: () => { goal.setAlpha(1); }
                    });
                }
            }
        }
    });

    // Animations (From UI_Element.js)
    GameUI.createAnimations(this);
    
    this.cameras.main.centerOn(300, 300);

    // Controls UI (From UI_Element.js)
    GameUI.createControlsUI(currentLevel, isBossLevel(currentLevel));
    
    setupControls(this);
    updateGravity(this);
}

/* =====================================================
   UPDATE LOOP
===================================================== */
function update() {
    player.setRotation(-this.cameras.main.rotation);
    isGrounded = checkGrounded();
    
    // UI Update (From UI_Element.js)
    GameUI.updateButtonVisuals(isGrounded);

    if (isRotating) { player.body.setVelocity(0); return; }

    let moveX = 0;
    if (moveLeft)  moveX -= 1;
    if (moveRight) moveX += 1;

    if (!isGrounded) { player.anims.play('jump', true); } 
    else if (moveX !== 0) { player.anims.play('run', true); player.setFlipX(moveX < 0); } 
    else { player.anims.play('idle', true); }

    applyMovement(moveX, playerSpeed, playerJumpForce);

    // Sudden Items
    GameItems.groups.sudden.getChildren().forEach(item => {
        if (item.getData('triggered')) return;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, item.x, item.y);
        let trigger = false;
        if (item.getData('triggerType') === 'distance' && dist < item.getData('triggerValue')) trigger = true;
        else if (item.getData('triggerType') === 'jump' && doJump && dist < 150) trigger = true;

        if (trigger) {
            item.setData('triggered', true); 
            item.setAlpha(1); 
            item.body.checkCollision.none = false; 
            sceneRef.sound.play('s_break'); 
        }
    });

    

    // Win Logic
    const canEnterGoal = goal && !goal.getData('isFakeInitially') && (goal.getData('unlocked') || !goal.getData('hidden'));
    if (tryEnter && isGrounded && canEnterGoal && sceneRef.physics.overlap(player, goal)) {
       this.physics.pause(); 
       resetInputState(); 
       GameProgress.unlock(currentLevel + 1);
       sceneRef.sound.play('s_win'); 
       
       const isFinalLevel = currentLevel >= 10;
       GameUI.showPopup({ 
           type: isFinalLevel ? 'victory' : 'win', 
           title: isFinalLevel ? 'You Beat Devil Rotate! 👑' : 'Level Complete', 
           primaryText: isFinalLevel ? 'Play Again' : 'Next', 
           onPrimary: () => { 
               sceneRef.sound.play('s_click'); 
               resetInputState(); this.physics.resume(); 
               if (isFinalLevel) {
                   window.startLevel(1);
               } else {
                   window.startLevel(currentLevel + 1); 
               }
           }, 
           onHome: () => { 
               sceneRef.sound.play('s_click'); 
               location.reload(); 
           } 
       });
       tryEnter = false;
    }
}

/* =====================================================
   HELPERS (Logic only)
===================================================== */
function applyMovement(moveX, speed, jumpForce) {
    const r = normalizeRotation();
    if (doJump && isGrounded) { sceneRef.sound.play('s_jump'); }
    if (r === 0) { player.body.setVelocityX(moveX * speed); if (doJump && isGrounded) player.body.setVelocityY(-jumpForce); }
    else if (r === -90) { player.body.setVelocityY(moveX * speed); if (doJump && isGrounded) player.body.setVelocityX(jumpForce); }
    else if (r === -180) { player.body.setVelocityX(-moveX * speed); if (doJump && isGrounded) player.body.setVelocityY(jumpForce); }
    else if (r === -270) { player.body.setVelocityY(-moveX * speed); if (doJump && isGrounded) player.body.setVelocityX(-jumpForce); }
}

function rotateWorld(scene, dir) {
    if (isRotating || !isGrounded) return;
    isRotating = true;
    scene.sound.play('s_rotate'); 
    const angleChange = dir === 1 ? -90 : 90;
    const newAngle = rotationAngle + angleChange;
    scene.tweens.add({ targets: scene.cameras.main, rotation: Phaser.Math.DegToRad(newAngle), duration: 600, ease: 'Cubic.easeInOut', onComplete: () => { rotationAngle = newAngle; updateGravity(scene); updatePlayerHitbox(); isRotating = false; } });
}

function normalizeRotation() { let r = rotationAngle % 360; if (r > 0) r -= 360; return r; }
function updateGravity(scene) {
    scene.physics.world.gravity.set(0, 0); const r = normalizeRotation();
    if (r === 0) scene.physics.world.gravity.y = 600;
    if (r === -90) scene.physics.world.gravity.x = -600;
    if (r === -180) scene.physics.world.gravity.y = -600;
    if (r === -270) scene.physics.world.gravity.x = 600;
}
function checkGrounded() {
    const t = player.body.touching, b = player.body.blocked, r = normalizeRotation();
    if (r === 0) return t.down || b.down;
    if (r === -90) return t.left || b.left;
    if (r === -180) return t.up || b.up;
    if (r === -270) return t.right || b.right;
}

function updatePlayerHitbox() {
    if (!player || !player.body) return; 
    const r = normalizeRotation();
    const boxW = 100; const boxH = 230; const offX = 200; const offY = 130;
    if (r === 0) { player.body.setSize(boxW, boxH); player.body.setOffset(offX, offY); }
    else if (r === -180) { player.body.setSize(boxW, boxH); player.body.setOffset(offX, offY); }
    else if (r === -90) { player.body.setSize(boxH, boxW); player.body.setOffset(offY, offX); }
    else if (r === -270) { player.body.setSize(boxH, boxW); player.body.setOffset(offY, offX); }
}

window.resetLevel = function(scene) {
    rotationAngle = 0; 
    isRotating = false;
    resetInputState();
    document.getElementById('controls-root')?.remove();

    scene.scene.restart();
};

const activeKeys = new Set();
const touchState = { left: false, right: false, up: false, down: false };
const tapTimeouts = { left: null, right: null, up: null, down: null };
const pressTimes = { left: 0, right: 0, up: 0, down: 0 };
let isKeyboardInitialized = false;

function initKeyboardListeners() {
    if (isKeyboardInitialized) return;
    isKeyboardInitialized = true;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetInputState);
}

function handleKeyDown(e) {
    // 1. Space / Enter on Death or Win popup (Quick restart / next level)
    const popupPrimary = document.getElementById('popupPrimary');
    if (popupPrimary && (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter')) {
        e.preventDefault();
        popupPrimary.click();
        return;
    }

    // 3. Toggle Controls Help with H or ?
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        const panel = document.getElementById('controlsHelpPanel');
        if (panel) {
            panel.classList.toggle('collapsed');
            window.helpPanelDismissed = panel.classList.contains('collapsed');
        }
        return;
    }

    // 4. Pause / Resume with Esc or P
    if (e.code === 'Escape' || e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const pauseOverlay = document.getElementById('pause-overlay');
        const popupOverlay = document.getElementById('popup-overlay');
        if (pauseOverlay) {
            document.getElementById('pResume')?.click();
        } else if (!popupOverlay && !document.getElementById('ui-root')) {
            document.getElementById('btnMenu')?.click();
        }
        return;
    }

    // Toggle physics hitbox debug with F2 or B
    if (e.code === 'F2' || e.code === 'KeyB') {
        if (sceneRef && sceneRef.physics && sceneRef.physics.world) {
            sceneRef.physics.world.drawDebug = !sceneRef.physics.world.drawDebug;
            if (!sceneRef.physics.world.drawDebug && sceneRef.physics.world.debugGraphic) {
                sceneRef.physics.world.debugGraphic.clear();
            }
        }
        return;
    }

    // 5. Prevent browser scroll for game keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'NumpadEnter'].includes(e.code)) {
        e.preventDefault();
    }

    // 6. If paused, game over, or main menu is open, ignore gameplay input
    if (document.getElementById('pause-overlay') || 
        document.getElementById('popup-overlay') || 
        document.getElementById('ui-root')) {
        return;
    }

    activeKeys.add(e.code);
    activeKeys.add(e.key.toLowerCase());

    // Rotate Left (Q)
    if ((e.code === 'KeyQ' || e.key.toLowerCase() === 'q') && !e.repeat) {
        if (sceneRef) rotateWorld(sceneRef, -1);
        document.getElementById('btnAntiClock')?.classList.add('key-active');
    }

    // Rotate Right (E)
    if ((e.code === 'KeyE' || e.key.toLowerCase() === 'e') && !e.repeat) {
        if (sceneRef) rotateWorld(sceneRef, 1);
        document.getElementById('btnClock')?.classList.add('key-active');
    }

    syncInputStates();
}

function handleKeyUp(e) {
    activeKeys.delete(e.code);
    activeKeys.delete(e.key.toLowerCase());

    if (e.code === 'KeyQ' || e.key.toLowerCase() === 'q') {
        document.getElementById('btnAntiClock')?.classList.remove('key-active');
    }
    if (e.code === 'KeyE' || e.key.toLowerCase() === 'e') {
        document.getElementById('btnClock')?.classList.remove('key-active');
    }

    syncInputStates();
}

function syncInputStates() {
    moveLeft = touchState.left || 
               activeKeys.has('KeyA') || 
               activeKeys.has('ArrowLeft') || 
               activeKeys.has('a');

    moveRight = touchState.right || 
                activeKeys.has('KeyD') || 
                activeKeys.has('ArrowRight') || 
                activeKeys.has('d');

    doJump = touchState.up || 
             activeKeys.has('KeyW') || 
             activeKeys.has('ArrowUp') || 
             activeKeys.has('Space') || 
             activeKeys.has('w') || 
             activeKeys.has(' ');

    tryEnter = touchState.down || 
               activeKeys.has('KeyS') || 
               activeKeys.has('ArrowDown') || 
               activeKeys.has('Enter') || 
               activeKeys.has('NumpadEnter') || 
               activeKeys.has('enter') || 
               activeKeys.has('s');

    // Visual button feedback (Emulator style active highlights)
    setButtonActive('btnLeft', moveLeft);
    setButtonActive('btnRight', moveRight);
    setButtonActive('btnUp', doJump);
    setButtonActive('btnDown', tryEnter);
}

function setButtonActive(id, isActive) {
    const el = document.getElementById(id);
    if (!el) return;
    if (isActive) el.classList.add('key-active');
    else el.classList.remove('key-active');
}

function startTouchButton(stateKey) {
    if (tapTimeouts[stateKey]) {
        clearTimeout(tapTimeouts[stateKey]);
        tapTimeouts[stateKey] = null;
    }
    pressTimes[stateKey] = performance.now();
    touchState[stateKey] = true;
    syncInputStates();
}

function stopTouchButton(stateKey, minDuration = 130) {
    const elapsed = performance.now() - (pressTimes[stateKey] || 0);
    const remaining = minDuration - elapsed;
    if (remaining > 0) {
        if (tapTimeouts[stateKey]) clearTimeout(tapTimeouts[stateKey]);
        tapTimeouts[stateKey] = setTimeout(() => {
            touchState[stateKey] = false;
            syncInputStates();
            tapTimeouts[stateKey] = null;
        }, remaining);
    } else {
        touchState[stateKey] = false;
        syncInputStates();
    }
}

function bindDirectionButton(id, stateKey, minDuration = 130) {
    const el = document.getElementById(id);
    if (!el) return;

    let isPressing = false;

    const start = (e) => {
        if (e && e.cancelable) e.preventDefault();
        isPressing = true;
        startTouchButton(stateKey);
    };

    const stop = (e) => {
        if (e && e.cancelable) e.preventDefault();
        if (!isPressing) return;
        isPressing = false;
        stopTouchButton(stateKey, minDuration);
    };

    // Pointer events with capture - keeps touch locked to button even if finger rolls slightly
    el.addEventListener('pointerdown', (e) => {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        start(e);
    }, { passive: false });

    el.addEventListener('pointerup', (e) => {
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        stop(e);
    }, { passive: false });

    el.addEventListener('pointercancel', (e) => {
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        stop(e);
    }, { passive: false });

    // Touch fallback for older WebViews / APK environments
    el.addEventListener('touchstart', (e) => {
        if (!isPressing) start(e);
    }, { passive: false });

    el.addEventListener('touchend', (e) => {
        stop(e);
    }, { passive: false });

    el.addEventListener('touchcancel', (e) => {
        stop(e);
    }, { passive: false });
}

function bindActionButton(id, action) {
    const el = document.getElementById(id);
    if (!el) return;

    let lastTrigger = 0;
    const trigger = (e) => {
        if (e && e.cancelable) e.preventDefault();
        const now = performance.now();
        if (now - lastTrigger < 160) return;
        lastTrigger = now;
        setButtonActive(id, true);
        action();
        setTimeout(() => setButtonActive(id, false), 160);
    };

    el.addEventListener('pointerdown', trigger, { passive: false });
    el.addEventListener('touchstart', trigger, { passive: false });
}

function setupControls(scene) {
    initKeyboardListeners();

    bindActionButton('btnClock', () => rotateWorld(scene, 1)); 
    bindActionButton('btnAntiClock', () => rotateWorld(scene, -1));

    bindDirectionButton('btnLeft', 'left', 130);
    bindDirectionButton('btnRight', 'right', 130);
    bindDirectionButton('btnUp', 'up', 120);
    bindDirectionButton('btnDown', 'down', 120);
    
    const menuBtn = document.getElementById('btnMenu');
    if (menuBtn) {
        const openMenu = (e) => { 
            if (e && e.cancelable) e.preventDefault();
            scene.sound.play('s_click'); 
            scene.physics.pause(); 
            resetInputState(); 
            GameUI.showPausePopup(scene); 
        };
        menuBtn.onclick = openMenu;
        menuBtn.addEventListener('touchstart', openMenu, { passive: false });
    }
}

function resetInputState() { 
    activeKeys.clear();
    Object.keys(tapTimeouts).forEach(k => {
        if (tapTimeouts[k]) {
            clearTimeout(tapTimeouts[k]);
            tapTimeouts[k] = null;
        }
    });
    touchState.left = false; 
    touchState.right = false; 
    touchState.up = false; 
    touchState.down = false; 
    moveLeft = false; 
    moveRight = false; 
    doJump = false; 
    tryEnter = false; 
    ['btnLeft', 'btnRight', 'btnUp', 'btnDown', 'btnClock', 'btnAntiClock'].forEach(id => {
        document.getElementById(id)?.classList.remove('key-active');
    });
}
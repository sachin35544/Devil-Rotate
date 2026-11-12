/* ====================================================================
   LEVELS CONFIGURATION GUIDE
====================================================================
   
   DEFAULT VALUES (Agar change na kare to):
   - Speed: 200
   - Jump: 300

   HOW TO CHANGE VALUES:
   Jis level me change krna hai vaha likhe:
   speed: 300, 
   jump: 400,

   ITEMS LIST & SYNTAX:
   
   1. Start Position:  start: { x: 100, y: 500 }
   2. Gate (Exit):     gate: { x: 400, y: 200 }
   
   3. Platform (Normal Wall):
      platforms: [ { x: 200, y: 400, w: 100, h: 20 }, ... ]
      
   4. Spikes (Visible):
      spikes: [ { x: 100, y: 500, dir: 0 }, ... ] (dir: 0=up, 1=right, 2=down, 3=left)
      
   5. Invisible Spikes (Hidden Death):
      invisibleSpikes: [ { x: 100, y: 500, dir: 0 }, ... ]
      
   6. Invisible Block (Hawa me diwar - Takrane pe dikhegi):
      invisibleBlock: [ { x: 200, y: 300, w: 50, h: 100 }, ... ]
      
   7. Fake Block (Dikhta hai par aar-paar ja sakte hain):
      fakeBlock: [ { x: 200, y: 300, w: 50, h: 100 }, ... ]
      
   8. Temp Block (Touch ke 1s baad toot jayega):
      tempBlock: [ { x: 300, y: 400, w: 100, h: 20 }, ... ]
      
   9. Button (Down key to interact):
      buttons: [ { x: 150, y: 500, id: 'btn1', target: 'door1', action: 'toggle' } ]
      
   10. Sudden Block/Spike (Achanak aane wala):
       suddenBlock: [ { x: 200, y: 400, w: 100, h: 20, triggerType: 'distance', triggerValue: 100 } ]
       suddenSpikes: [ { x: 200, y: 400, dir: 0, triggerType: 'jump', triggerValue: 50 } ]
       
   11. Fake Door (Maut ka darwaza):
       fakeDoor: [ { x: 500, y: 200, waitToReveal: 5 } ] (5s wait kroge to asli door aayega, warna death)
==================



/* =====================================================
   LEVELS.JS
   Sirf Level ka data (Coordinates).
===================================================== */

window.GameProgress = {
    unlockedLevel: parseInt(localStorage.getItem('unlockedLevel')) || 1,
    unlock(level) {
        if (level > this.unlockedLevel) {
            this.unlockedLevel = level;
            localStorage.setItem('unlockedLevel', level);
        }
    }
};

window.LEVELS = {
    1: {
        // Start: Bottom Left
        start: { x: 60, y: 550 },

        // Gate: Top Right (Dikhta hai par pohuchna namumkin jaisa hai)
        gate: { x: 500, y: 183 },

        platforms: [

            // 2. WALL 1 (Left Divider) - Gap at TOP
            // Iske upar se kood ke jana hai
            { x: 200, y: 400, w: 20, h: 450 },

            // 3. WALL 2 (Right Divider) - Gap at BOTTOM
            { x: 400, y: 200, w: 20, h: 500 },

            // 4. Gate Platform (Top Right)
            { x: 520, y: 220, w: 120, h: 20 }
        ],

        spikes: [
            // --- LANE 1 (Start Zone) ---
            // Upar Ceiling par spikes hain 
            { x: 40, y: 30, dir: 2 },
            { x: 85, y: 30, dir: 2 },
            { x: 130, y: 30, dir: 2 },
            // left Wall par spikes hain
            { x: 35, y: 250, dir: 1 },
            { x: 35, y: 350, dir: 1 },
            // right Wall par spikes hain
            { x: 570, y: 450, dir: 3 },
            // Wall 1 ke Left side par spikes
            { x: 180, y: 195, dir: 3 },
            { x: 180, y: 330, dir: 3 },
            { x: 180, y: 430, dir: 3 },

            // --- LANE 2 (Middle Drop) ---
            // Niche Floor par spikes hain
            { x: 255, y: 570, dir: 0 },
            { x: 300, y: 570, dir: 0 },
            { x: 345, y: 570, dir: 0 },
            // Wall 1 ke Right side par spikes
            { x: 220, y: 195, dir: 1 },
            { x: 220, y: 380, dir: 1 },
            // Wall 2 ke Left side par spikes
            { x: 380, y: 100, dir: 3 },
            { x: 380, y: 250, dir: 3 },
            { x: 380, y: 400, dir: 3 },

            // --- LANE 3 (Final Climb) ---
            // Upar Gate ke bagal me Ceiling par spikes
            { x: 455, y: 30, dir: 2 },
            { x: 500, y: 30, dir: 2 },
            // Wall 2 ke Right side par spikes 
            { x: 420, y: 330, dir: 1 },
        ],

        // Empty arrays to prevent errors
        buttons: [],
        invisibleSpikes: [],
        invisibleBlock: [],
        fakeBlock: [],
        tempBlock: [],
        suddenBlock: [],
        suddenSpikes: [],
        fakeDoor: []
    },

    2: {
        // Start: Bottom Left 
        start: { x: 80, y: 450 },

        // Gate: Center of the screen 
        gate: { x: 300, y: 300 },

        platforms: [
            // 1. Start Island
            { x: 80, y: 500, w: 80, h: 20 },

            // 2. The High Jump (Top Left)
            { x: 80, y: 100, w: 80, h: 20 },

            // 3. The Long Shot (Top Right)
            { x: 520, y: 100, w: 80, h: 20 },

            // 4. The Drop (Bottom Right)
            { x: 520, y: 500, w: 80, h: 20 },

            // 5. Final Platform (Center - Gate ke neeche)
            { x: 300, y: 340, w: 80, h: 20 }
        ],

        spikes: [
            // --- THE BORDER OF DEATH ---
            // Screen ke chaaron taraf spikes hain. 
            // Agar island miss kiya toh game over. No wall sliding.

            // Bottom Border
            { x: 180, y: 570, dir: 0 }, { x: 250, y: 570, dir: 0 },
            { x: 350, y: 570, dir: 0 }, { x: 450, y: 570, dir: 0 },

            // Top Border
            { x: 180, y: 30, dir: 2 }, { x: 250, y: 30, dir: 2 },
            { x: 350, y: 30, dir: 2 }, { x: 450, y: 30, dir: 2 },

            // Left Border
            { x: 35, y: 200, dir: 1 }, { x: 35, y: 300, dir: 1 }, { x: 35, y: 400, dir: 1 },

            // Right Border
            { x: 570, y: 200, dir: 3 }, { x: 570, y: 300, dir: 3 }, { x: 570, y: 400, dir: 3 },

            // --- THE TRAP ISLANDS ---
            // Har island ke neeche spikes hain taaki tu "underneath" chipak na sake
            { x: 80, y: 520, dir: 2 }, // Start ke neeche
            { x: 80, y: 75, dir: 0 },  // Top-Left ke neeche (technically upar visual me)
            { x: 520, y: 75, dir: 0 }, // Top-Right ke neeche
            { x: 520, y: 525, dir: 2 }, // Bottom-Right ke neeche
        ],

        // No trolls, sirf tera skill aur physics
        buttons: [],
        fakeBlock: [],
        invisibleSpikes: [],
        invisibleBlock: [],
        tempBlock: [],
        suddenBlock: [],
        suddenSpikes: [],
        fakeDoor: []
    },
    3: {
        // Start: Top Left
        start: { x: 60, y: 100 },

        // Gate: Top Right (Bilkul samne dikh raha hai)
        gate: { x: 550, y: 190, rotation: 180 },

        platforms: [

            // 1. Safe Platform for Start
            { x: 60, y: 150, w: 80, h: 20 },

            // 2. Safe Platform for Gate
            { x: 545, y: 150, w: 80, h: 20 },

            // 3. Side walls left
            { x: 515, y: 190, w: 20, h: 100 },

            // 4. Middle Obstacle (Ceiling par)
            { x: 300, y: 250, w: 20, h: 100 },

            // 5 left down platform 
            { x: 120, y: 400, w: 120, h: 20 },

            // 6 right down platform
            { x: 480, y: 400, w: 120, h: 20 }
        ],

        // --- TRAP 1: THE FAKE BRIDGE ---
        fakeBlock: [
            { x: 300, y: 150, w: 300, h: 20 }
        ],

        spikes: [
            // --- Bottom Floor Spikes (Girne walon ka swagat) ---
            { x: 100, y: 570, dir: 0 },
            { x: 145, y: 570, dir: 0 },
            { x: 190, y: 570, dir: 0 },
            { x: 235, y: 570, dir: 0 },
            { x: 280, y: 570, dir: 0 },
            { x: 325, y: 570, dir: 0 },
            { x: 370, y: 570, dir: 0 },
            { x: 415, y: 570, dir: 0 },
            { x: 460, y: 570, dir: 0 },
            { x: 505, y: 570, dir: 0 },

            // --- Obstacle Spikes ---
            // Jo beech wali deewar hai uske dono taraf
            { x: 275, y: 250, dir: 3 }, // Left side
            { x: 325, y: 250, dir: 1 }, // Right side

            //left down platform ke upar
            { x: 80, y: 380, dir: 0 },
            { x: 125, y: 380, dir: 0 },
            { x: 160, y: 380, dir: 0 },

            // right down platform ke upar
            { x: 440, y: 380, dir: 0 },
            { x: 485, y: 380, dir: 0 },
            { x: 520, y: 380, dir: 0 },

            // main left wall spikes
            { x: 35, y: 250, dir: 1 },
            { x: 35, y: 205, dir: 1 },
            { x: 35, y: 40, dir: 1 },

            // main right wall spikes
            { x: 565, y: 500, dir: 3 },
            { x: 565, y: 455, dir: 3 },
            { x: 565, y: 40, dir: 3 },

            // fack bridge ke upar spikes
            { x: 300, y: 130, dir: 0 },
        ],


        // Empty arrays
        buttons: [],
        invisibleBlock: [],
        tempBlock: [],
        suddenBlock: [],
        suddenSpikes: [],
        fakeDoor: []
    },

    4: {
        // Start: Top Left (Safe Zone)
        start: { x: 60, y: 100 },

        // Gate: Bottom Right (Rotation 90 degree)
        gate: { x: 550, y: 540, rotation: -90 },

        platforms: [
            // 1. Safe Start Platform
            { x: 60, y: 150, w: 100, h: 20 },

        ],

        // --- MAIN PATH: EXTRA TEMP BLOCKS ---
        tempBlock: [
            { x: 180, y: 195, w: 20, h: 150 }, // Step 1
            { x: 290, y: 305, w: 20, h: 150 }, // Step 2 (New)
            { x: 400, y: 415, w: 20, h: 150 }, // Step 3
            { x: 500, y: 500, w: 20, h: 120 }  // Step 4 (New - Near Gate)
        ],

        spikes: [
            // =========================================
            // 💀 THE BORDER OF DEATH (Chaaron taraf Spikes)
            // =========================================

            // --- TOP BORDER ---
            { x: 30, y: 30, dir: 2 }, { x: 90, y: 30, dir: 2 }, { x: 150, y: 30, dir: 2 },
            { x: 210, y: 30, dir: 2 }, { x: 270, y: 30, dir: 2 }, { x: 330, y: 30, dir: 2 },
            { x: 390, y: 30, dir: 2 }, { x: 450, y: 30, dir: 2 }, { x: 510, y: 30, dir: 2 },
            { x: 570, y: 30, dir: 2 },

            // --- BOTTOM BORDER ---
            { x: 30, y: 570, dir: 0 }, { x: 90, y: 570, dir: 0 }, { x: 150, y: 570, dir: 0 },
            { x: 210, y: 570, dir: 0 }, { x: 270, y: 570, dir: 0 }, { x: 330, y: 570, dir: 0 },
            { x: 390, y: 570, dir: 0 }, { x: 450, y: 570, dir: 0 }, { x: 510, y: 570, dir: 0 },
            { x: 570, y: 570, dir: 0 },

            // --- LEFT BORDER ---
            { x: 35, y: 80, dir: 1 }, { x: 35, y: 140, dir: 1 }, { x: 35, y: 200, dir: 1 },
            { x: 35, y: 260, dir: 1 }, { x: 35, y: 320, dir: 1 }, { x: 35, y: 380, dir: 1 },
            { x: 35, y: 440, dir: 1 }, { x: 35, y: 500, dir: 1 },

            // --- RIGHT BORDER ---
            { x: 565, y: 80, dir: 3 }, { x: 565, y: 140, dir: 3 }, { x: 565, y: 200, dir: 3 },
            { x: 565, y: 260, dir: 3 }, { x: 565, y: 320, dir: 3 }, { x: 565, y: 380, dir: 3 },
            { x: 565, y: 440, dir: 3 }, { x: 565, y: 500, dir: 3 },

            // --- INTERNAL SPIKES (Precision badhane ke liye) ---
            { x: 180, y: 110, dir: 0 }, // Step 1 Top
            { x: 290, y: 220, dir: 0 }, // Step 2 Top
            { x: 400, y: 330, dir: 0 }, // Step 3 Top
            { x: 500, y: 430, dir: 0 }, // Step 4 Top

            // Steps ke beech mein spikes (Gap traps)
            { x: 235, y: 240, dir: 0 }, // Gap 1-2
            { x: 345, y: 360, dir: 0 }, // Gap 2-3
            { x: 450, y: 470, dir: 0 }  // Gap 3-4
        ],

        fakeBlock: [],
        buttons: [],
        invisibleSpikes: [],
        invisibleBlock: [],
        suddenBlock: [],
        suddenSpikes: [],
        fakeDoor: []
    },

    5: {
        start: { x: 300, y: 500 },

        gate: { x: 550, y: 300, rotation: -90 },

        // --- FAKE DOOR ---
        fakeDoor: [
            { x: 50, y: 300, rotation: 90 }
        ],

        platforms: [
            { x: 300, y: 550, w: 60, h: 20 },

            { x: 300, y: 50, w: 60, h: 20 },
        ],
        tempBlock: [
            { x: 300, y: 300, w: 30, h: 30 }, // (Center Air)
            { x: 450, y: 150, w: 30, h: 30 }, // (Top Right Air)
            { x: 150, y: 450, w: 30, h: 30 }, // (Bottom Left Air)   
            { x: 500, y: 300, w: 20, h: 60 }
        ],

        fakeBlock: [
            { x: 100, y: 305, w: 20, h: 60 }
        ],

        spikes: [
            // --- FLOOR ---
            { x: 100, y: 570, dir: 0 }, { x: 150, y: 570, dir: 0 }, { x: 200, y: 570, dir: 0 },
            { x: 400, y: 570, dir: 0 }, { x: 450, y: 570, dir: 0 }, { x: 500, y: 570, dir: 0 },

            // --- CEILING SPIKES ---
            { x: 100, y: 30, dir: 2 }, { x: 150, y: 30, dir: 2 }, { x: 200, y: 30, dir: 2 },
            { x: 400, y: 30, dir: 2 }, { x: 450, y: 30, dir: 2 }, { x: 500, y: 30, dir: 2 },

            // --- FAKE DOOR TRAP ---
            // Fake block ke niche spikes
            { x: 45, y: 345, dir: 2 },
            { x: 90, y: 345, dir: 2 },
            { x: 35, y: 450, dir: 1 },

            // Fake block ke upar spikes
            { x: 45, y: 260, dir: 0 },
            { x: 90, y: 260, dir: 0 },
            { x: 35, y: 150, dir: 1 },

            // --- REAL GATE GUARD ---
            // Gate ke niche spikes
            { x: 555, y: 345, dir: 2 },
            { x: 510, y: 345, dir: 2 },
            { x: 565, y: 450, dir: 3 },

            // Gate ke upar spikes
            { x: 510, y: 255, dir: 0 },
            { x: 565, y: 150, dir: 3 },
            { x: 555, y: 255, dir: 0 }

        ],

        buttons: [], invisibleSpikes: [], invisibleBlock: [], suddenBlock: [], suddenSpikes: []
    },

    6: {
        // Start: Bottom Left
        start: { x: 60, y: 530 },

        // Gate: Top Right
        gate: { x: 540, y: 130, rotation: 0 },

        platforms: [
            { x: 150, y: 525, w: 60, h: 20 },  // 1. Step 1
            { x: 220, y: 455, w: 60, h: 20 },  // 2. Step 2
            { x: 290, y: 380, w: 60, h: 20 },  // 3. Step 3
            { x: 430, y: 230, w: 60, h: 20 },  // 5. Step 5
            { x: 530, y: 165, w: 110, h: 20 },  // 6. Step 6
        ],

        // --- TEMP BLOCKS (Need Speed) ---
        tempBlock: [
            { x: 360, y: 305, w: 60, h: 20 },  // 4. Step 4
        ],

        // --- SUDDEN ITEMS (THE CHEATING PART) ---
        suddenSpikes: [
            { x: 70, y: 500, dir: 2, triggerType: 'jump' },
            // other spikes left wall
            { x: 570, y: 450, dir: 3, triggerType: 'distance', triggerValue: 50 },
            { x: 570, y: 495, dir: 3, triggerType: 'distance', triggerValue: 50 },
            // other spikes right wall
            { x: 30, y: 200, dir: 1, triggerType: 'distance', triggerValue: 50 },
            { x: 30, y: 400, dir: 1, triggerType: 'distance', triggerValue: 50 },
            // other spikes top wall
            { x: 120, y: 25, dir: 2, triggerType: 'distance', triggerValue: 50 },
            { x: 165, y: 25, dir: 2, triggerType: 'distance', triggerValue: 50 },
            { x: 390, y: 25, dir: 2, triggerType: 'distance', triggerValue: 50 },

            // spikes door ke paas
            { x: 500, y: 130, dir: 3, triggerType: 'distance', triggerValue: 50 },
            { x: 500, y: 85, dir: 3, triggerType: 'distance', triggerValue: 50 }
        ],

        spikes: [
            // Visible Spikes
            { x: 300, y: 570, dir: 0 }, // Floor Spike
            { x: 300, y: 30, dir: 2 }, // Ceiling Spike
            { x: 35, y: 300, dir: 1 }, // Left Wall Spike
            { x: 565, y: 300, dir: 3 },  // Right Wall Spike

            // steps ke just niche spikes
            { x: 150, y: 545, dir: 2 }, // Step 1 Ceiling Spike
            { x: 220, y: 475, dir: 2 }, // Step 2 Ceiling Spike
            { x: 290, y: 400, dir: 2 }, // Step 3 Ceiling Spike
            { x: 360, y: 325, dir: 2 }, // Step 4 Ceiling Spike
            { x: 430, y: 250, dir: 2 }, // Step 5 Ceiling Spike
            { x: 530, y: 185, dir: 2 }   // Step 6 Ceiling Spike
        ],

        // Empty Arrays
        fakeDoor: [], buttons: [], invisibleSpikes: [], invisibleBlock: [], fakeBlock: [], suddenBlock: []
    },
    7: {
        // --- LEVEL 7: THE GRAVITY PIT ---
        // Difficulty: Harder than 1-6 (Precision jumps + Crumbling steps + Troll block)
        start: { x: 70, y: 530 },
        gate: { x: 530, y: 525, rotation: 0 },

        platforms: [
            // Safe Start Ledge
            { x: 70, y: 565, w: 90, h: 20 },

            // Intermediate Solid Step 1
            { x: 70, y: 380, w: 60, h: 20 },

            // Wall 1 (Divider): Closes the floor, gap at top (y < 230)
            { x: 200, y: 410, w: 20, h: 360 },

            // Wall 2 (Ceiling Divider): Attached to ceiling, gap at bottom (y > 370)
            { x: 400, y: 190, w: 20, h: 360 },

            // Mid chamber safe island
            { x: 290, y: 330, w: 70, h: 20 },

            // Exit Gate Plinth
            { x: 530, y: 560, w: 80, h: 20 },
            { x: 470, y: 430, w: 60, h: 20 }
        ],

        // Temp Blocks: Breaking blocks (must be fast!)
        tempBlock: [
            { x: 140, y: 470, w: 50, h: 20 }, // Step 1
            { x: 140, y: 290, w: 50, h: 20 }, // Step 2 (high climb)
            { x: 90, y: 200, w: 50, h: 20 },  // Step 3 (over Wall 1)
            { x: 340, y: 240, w: 50, h: 20 }, // Step 4 (chasm crossing)
            { x: 440, y: 270, w: 50, h: 20 }  // Step 5 (drop to gate)
        ],

        // Invisible Troll Block: Blocks greedy super-jump
        invisibleBlock: [
            { x: 140, y: 380, w: 40, h: 20 }
        ],

        // Invisible Spikes: Punishment for shortcuts
        invisibleSpikes: [
            { x: 530, y: 380, dir: 0 }
        ],

        spikes: [
            // Border Spikes
            { x: 250, y: 570, dir: 0 }, { x: 300, y: 570, dir: 0 }, { x: 350, y: 570, dir: 0 },
            { x: 150, y: 30, dir: 2 }, { x: 250, y: 30, dir: 2 }, { x: 350, y: 30, dir: 2 },
            { x: 35, y: 280, dir: 1 }, { x: 35, y: 180, dir: 1 },
            { x: 565, y: 480, dir: 3 }, { x: 565, y: 380, dir: 3 },

            // Wall 1 Spikes
            { x: 220, y: 280, dir: 1 }, { x: 220, y: 440, dir: 1 },
            { x: 180, y: 320, dir: 3 },

            // Wall 2 Spikes
            { x: 380, y: 150, dir: 3 }, { x: 380, y: 290, dir: 3 },
            { x: 420, y: 200, dir: 1 }, { x: 420, y: 340, dir: 1 }
        ],

        buttons: [], fakeBlock: [], suddenBlock: [], suddenSpikes: [], fakeDoor: []
    },

    8: {
        // --- LEVEL 8: THE AMBUSH CHAMBER ---
        // Difficulty: Harder than Level 7 (Sudden jump traps + Fake floor + Stepped gauntlet)
        start: { x: 70, y: 70 },
        gate: { x: 520, y: 520, rotation: 0 }, // Clean bottom-right exit plinth

        platforms: [
            // Start Platform (Top-Left)
            { x: 70, y: 110, w: 90, h: 20 },

            // Tier 1 Drop Ledge
            { x: 120, y: 220, w: 80, h: 20 },

            // Ceiling Divider Wall (from y=20 down to y=320, gap at y>320)
            { x: 310, y: 170, w: 20, h: 300 },

            // Lower Passage Step (Right side)
            { x: 420, y: 360, w: 70, h: 20 },

            // Goal Gate Platform (Bottom-Right)
            { x: 520, y: 560, w: 90, h: 20 }
        ],

        // Fake bridge: Looks solid from start, but collapses under player!
        fakeBlock: [
            { x: 190, y: 110, w: 80, h: 20 }
        ],

        // Temp blocks (200ms crumbling steps)
        tempBlock: [
            { x: 220, y: 280, w: 70, h: 20 }, // Step under bridge
            { x: 310, y: 420, w: 80, h: 20 }, // Passage step under divider
            { x: 460, y: 460, w: 60, h: 20 }  // Pre-gate step
        ],

        // Sudden Spikes: Ambush traps that trigger on jump!
        suddenSpikes: [
            { x: 170, y: 180, dir: 2, triggerType: 'jump' },
            { x: 365, y: 360, dir: 0, triggerType: 'jump' },
            { x: 490, y: 460, dir: 3, triggerType: 'distance', triggerValue: 60 }
        ],

        // Sudden Block: Ambush wall that pops up if rushing
        suddenBlock: [
            { x: 370, y: 240, w: 20, h: 70, triggerType: 'distance', triggerValue: 70 }
        ],

        spikes: [
            // Floor spikes of death
            { x: 120, y: 570, dir: 0 }, { x: 200, y: 570, dir: 0 }, { x: 280, y: 570, dir: 0 },
            { x: 380, y: 570, dir: 0 }, { x: 440, y: 570, dir: 0 },

            // Ceiling spikes
            { x: 150, y: 30, dir: 2 }, { x: 230, y: 30, dir: 2 },
            { x: 410, y: 30, dir: 2 }, { x: 490, y: 30, dir: 2 },

            // Divider Wall Spikes
            { x: 290, y: 160, dir: 3 }, { x: 290, y: 240, dir: 3 },
            { x: 330, y: 160, dir: 1 }, { x: 330, y: 240, dir: 1 },

            // Outer Wall Spikes
            { x: 35, y: 320, dir: 1 }, { x: 35, y: 420, dir: 1 },
            { x: 565, y: 260, dir: 3 }, { x: 565, y: 360, dir: 3 }
        ],

        buttons: [], invisibleBlock: [], invisibleSpikes: [], fakeDoor: []
    },

    9: {
        // --- LEVEL 9: THE 360° MAZE OF DECEPTION ---
        // Difficulty: Harder than Level 8 (4-Quadrant 360° Rotation Maze + Button + 2 Fake Doors)
        start: { x: 70, y: 520 },

        // REAL GATE: STARTS HIDDEN! Revealed only when button in Q3 is pressed!
        gate: { x: 520, y: 520, rotation: 0, hidden: true },

        // Fake doors: Multiple deceptive exits that kill on touch
        fakeDoor: [
            { x: 80, y: 100, rotation: 0 }, // Fake Door 1 in Q2 (Top-Left)
            { x: 420, y: 430, rotation: 0 }  // Fake Door 2 in Q4 (Bottom-Right)
        ],

        // Interactive Button: Down / S / Enter key to press -> REVEALS THE REAL GATE!
        buttons: [
            { x: 500, y: 120, id: 'btn9', target: 'gate9', action: 'unlock' }
        ],

        platforms: [
            // Q1 (Bottom-Left) Start Platform
            { x: 70, y: 560, w: 80, h: 20 },

            // Horizontal cross dividers (gap in center x: 220 to 380)
            { x: 120, y: 300, w: 200, h: 20 },
            { x: 480, y: 300, w: 200, h: 20 },

            // Vertical cross dividers (gap in center y: 220 to 380)
            { x: 300, y: 120, w: 20, h: 200 },
            { x: 300, y: 480, w: 20, h: 200 },

            // Q2 (Top-Left) Fake Door 1 Platform
            { x: 80, y: 140, w: 80, h: 20 },

            // Q3 (Top-Right) Button Platform
            { x: 500, y: 140, w: 80, h: 20 },

            // Q4 (Bottom-Right) Fake Door 2 Platform
            { x: 420, y: 470, w: 70, h: 20 },

            // Q4 (Bottom-Right) Real Gate Platform
            { x: 520, y: 560, w: 80, h: 20 }
        ],

        // Temp blocks
        tempBlock: [
            { x: 180, y: 430, w: 60, h: 20 }, // Q1 stepping stone
            { x: 190, y: 190, w: 60, h: 20 }, // Q2 bridge
            { x: 400, y: 180, w: 60, h: 20 }  // Q3 bridge
        ],

        // Invisible troll block blocking shortcut
        invisibleBlock: [
            { x: 300, y: 300, w: 30, h: 30 }
        ],

        // Sudden Spikes guarding fake door
        suddenSpikes: [
            { x: 140, y: 130, dir: 3, triggerType: 'distance', triggerValue: 60 },
            { x: 440, y: 290, dir: 0, triggerType: 'jump' }
        ],

        spikes: [
            // Q1 Spikes
            { x: 150, y: 570, dir: 0 }, { x: 220, y: 570, dir: 0 },
            { x: 35, y: 440, dir: 1 },

            // Q2 Spikes
            { x: 35, y: 220, dir: 1 }, { x: 140, y: 30, dir: 2 },

            // Cross Divider Spikes
            { x: 280, y: 120, dir: 3 }, { x: 320, y: 120, dir: 1 },
            { x: 280, y: 480, dir: 3 }, { x: 320, y: 480, dir: 1 },

            // Q4 Spikes
            { x: 360, y: 570, dir: 0 }, { x: 440, y: 570, dir: 0 },
            { x: 565, y: 430, dir: 3 }
        ],

        fakeBlock: [], suddenBlock: [], invisibleSpikes: []
    },

    10: {
        // --- LEVEL 10: DEVIL'S GAUNTLET (THE ULTIMATE BOSS LEVEL) ---
        // Difficulty: MAX!
        // Troll Mechanism: 
        // 1. Initially ONLY 1 gate is visible (Gate 1 at Top-Left). But it is FAKE and kills on touch!
        // 2. Pressing the Boss Button causes a NEW gate (Gate 2 at Top-Center) to appear with fanfare.
        // 3. BUT Gate 2 is also FAKE! 
        // 4. The Button actually transforms Gate 1 into the REAL exit!
        speed: 215,
        jump: 315,
        start: { x: 70, y: 520 },

        // GATE 1 (Visible at Top-Left from the start, but initially FAKE! Becomes REAL after button press!)
        gate: { x: 100, y: 120, rotation: 0, hidden: false, isFakeInitially: true },

        // GATE 2 (Bait Gate: Hidden at Top-Center at start, revealed on button press, but is deadly fake!)
        fakeDoor: [
            { x: 300, y: 120, rotation: 0, id: 'baitDoor', hidden: true }
        ],

        // Interactive Boss Button (Must be pressed with S / Down / Enter to activate the troll swap!)
        buttons: [
            { x: 510, y: 140, id: 'bossBtn', target: 'gate10', action: 'unlock' }
        ],

        platforms: [
            // Start Island (Bottom-Left)
            { x: 70, y: 560, w: 80, h: 20 },

            // Lower Central Divider Wall (from y=260 down to y=480)
            { x: 300, y: 370, w: 20, h: 220 },

            // Left Side Ascent Step 2 (Safe Platform)
            { x: 210, y: 400, w: 60, h: 20 },

            // Left Side Ascent Step 4 (Safe Platform)
            { x: 140, y: 310, w: 60, h: 20 },

            // Gate 1 Platform (Top-Left - where Gate 1 stands)
            { x: 100, y: 160, w: 80, h: 20 },

            // Gate 2 Platform (Top-Center - where Bait Gate 2 appears)
            { x: 300, y: 160, w: 80, h: 20 },

            // Right Side Ascent Step 1 (Safe Platform over divider)
            { x: 380, y: 300, w: 60, h: 20 },

            // Boss Button Plinth (Top-Right)
            { x: 510, y: 160, w: 80, h: 20 },

            // Lower Right Landing Step
            { x: 440, y: 440, w: 70, h: 20 }
        ],

        // Fake Blocks: Deceptive bridge between Gate 1 and Gate 2 that collapses immediately
        fakeBlock: [
            { x: 200, y: 160, w: 70, h: 20 }
        ],

        // Temp Blocks: Rapid crumbling steps (200ms)
        tempBlock: [
            { x: 140, y: 470, w: 50, h: 20 }, // Left Step 1
            { x: 90, y: 230, w: 50, h: 20 },  // Left Step 5 towards Gate 1
            { x: 440, y: 220, w: 50, h: 20 }  // Right Step to Boss Button
        ],

        // Invisible Troll Block: Overhead block knocks player if jumping carelessly
        invisibleBlock: [
            { x: 210, y: 330, w: 40, h: 20 }
        ],

        // Invisible Spikes: Mounted flush under the Boss Button platform
        invisibleSpikes: [
            { x: 510, y: 175, dir: 2 }
        ],

        // Sudden Block: Ambush wall that slams shut when approaching Gate 2
        suddenBlock: [
            { x: 255, y: 130, w: 20, h: 60, triggerType: 'distance', triggerValue: 60 }
        ],

        // Sudden Spikes: Jump-triggered ambush on right ascent
        suddenSpikes: [
            { x: 380, y: 275, dir: 0, triggerType: 'jump' }
        ],

        spikes: [
            // Border Spikes - The Floor of Skulls (Bottom)
            { x: 160, y: 570, dir: 0 }, { x: 200, y: 570, dir: 0 }, { x: 240, y: 570, dir: 0 },
            { x: 360, y: 570, dir: 0 }, { x: 400, y: 570, dir: 0 }, { x: 440, y: 570, dir: 0 },

            // Border Spikes - The Ceiling of Death (Top)
            { x: 150, y: 30, dir: 2 }, { x: 190, y: 30, dir: 2 },
            { x: 410, y: 30, dir: 2 }, { x: 450, y: 30, dir: 2 },

            // Divider Wall Spikes
            { x: 280, y: 330, dir: 3 }, { x: 280, y: 410, dir: 3 },
            { x: 320, y: 330, dir: 1 }, { x: 320, y: 410, dir: 1 },

            // Outer Wall Spikes
            { x: 30, y: 300, dir: 1 }, { x: 30, y: 420, dir: 1 },
            { x: 570, y: 300, dir: 3 }, { x: 570, y: 420, dir: 3 }
        ]
    }
};
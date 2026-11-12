/* =====================================================
   GAME_ITEM.JS
   Handles Preloading Items & Creation of Objects.
===================================================== */

window.GameItems = {

    defaults: { speed: 200, jump: 300 },

    groups: {
        platforms: null, spikes: null, sudden: null, temp: null, 
        fakeDoors: null, buttons: null, trollBlocks: null
    },

    /* --- 1. PRELOAD ITEMS (Moved from Controls) --- */
    preloadItems: function(scene) {
        scene.load.spritesheet('playerRun', 'assets/run.png', { frameWidth: 500, frameHeight: 500 });
        scene.load.spritesheet('playerJump', 'assets/jump.png', { frameWidth: 500, frameHeight: 500 });
        scene.load.spritesheet('thorn', 'assets/thorns.png', { frameWidth: 64, frameHeight: 55 });
        scene.load.spritesheet('button', 'assets/button.png', { frameWidth: 500, frameHeight: 500 });
    },

    /* --- 2. CREATE LEVEL & GROUPS --- */
    createLevel: function(scene, levelData) {
        
        this.groups.platforms = scene.physics.add.staticGroup();
        this.groups.spikes = scene.physics.add.staticGroup();
        this.groups.sudden = scene.physics.add.staticGroup(); 
        this.groups.temp = scene.physics.add.staticGroup();
        this.groups.fakeDoors = scene.physics.add.staticGroup();
        this.groups.buttons = scene.physics.add.staticGroup();
        this.groups.trollBlocks = scene.physics.add.staticGroup();

        let goalObject = null;

        if(levelData.gate) goalObject = this.createGate(scene, levelData.gate);
        if(levelData.platforms) levelData.platforms.forEach(p => this.createPlatform(scene, p));
        if(levelData.spikes) levelData.spikes.forEach(s => this.createSpike(scene, s, true));
        if(levelData.invisibleSpikes) levelData.invisibleSpikes.forEach(s => this.createSpike(scene, s, false));
        if(levelData.invisibleBlock) levelData.invisibleBlock.forEach(b => this.createTrollBlock(scene, b));
        if(levelData.fakeBlock) levelData.fakeBlock.forEach(b => this.createFakeVisualBlock(scene, b));
        if(levelData.tempBlock) levelData.tempBlock.forEach(b => this.createTempBlock(scene, b));
        if(levelData.buttons) levelData.buttons.forEach(b => this.createButton(scene, b));
        if(levelData.suddenBlock) levelData.suddenBlock.forEach(b => this.createSuddenItem(scene, b, 'block'));
        if(levelData.suddenSpikes) levelData.suddenSpikes.forEach(s => this.createSuddenItem(scene, s, 'spike'));
        if(levelData.fakeDoor) levelData.fakeDoor.forEach(d => this.createFakeDoor(scene, d));

        return {
            speed: levelData.speed !== undefined ? levelData.speed : this.defaults.speed,
            jump: levelData.jump !== undefined ? levelData.jump : this.defaults.jump,
            goal: goalObject, 
            start: levelData.start
        };
    },

    /* --- 3. OBJECT CREATION (Player, etc.) --- */
    createPlayer: function(scene, x, y) {
        const player = scene.physics.add.sprite(x, y, 'playerRun');
        player.setScale(0.2); // Scale constant se use karein ya direct value
        player.setDepth(10); 
        player.body.setCollideWorldBounds(true);
        return player;
    },

    createGate: function(scene, data) {
    const goal = scene.add.text(data.x, data.y, '🚪', { fontSize: '64px' }).setOrigin(0.47);
    goal.setScale(1, -1);

    if (data.rotation) {
        goal.setAngle(data.rotation);
    }
    
    scene.physics.add.existing(goal, true);
    
    // --- 1. TERE DEFAULT VALUES (Normal Door ke liye) ---
    goal.body.setSize(36, 60);
    goal.body.setOffset(26, -60);
    // --- 2. ROTATION KE HISAB SE ADJUSTMENTS ---
    if (data.rotation === 180) {
        goal.body.setOffset(20, -58); 
    }
    else if (data.rotation === 90 || data.rotation === -90) {
        goal.body.setSize(60, 36); 
        goal.body.setOffset(11, -48);
    }
    
    goal.setDepth(1); 

    if (data.hidden) {
        goal.setAlpha(0);
        goal.setData('hidden', true);
        goal.body.checkCollision.none = true;
    } else {
        goal.setData('hidden', false);
    }

    if (data.isFakeInitially) {
        goal.setData('isFakeInitially', true);
    } else {
        goal.setData('isFakeInitially', false);
    }

    return goal;
},

    createPlatform: function(scene, p) {
        const wall = this.createBaseWall(scene, p.x, p.y, p.w, p.h);
        this.groups.platforms.add(wall);
    },

    createBaseWall: function(scene, x, y, w, h) {
    const g = scene.add.graphics();
    g.fillStyle(0x2e2e2e); g.fillRect(x - w/2, y - h/2, w, h);
    g.fillStyle(0x4a4a4a); g.fillRect(x - w/2, y - h/2, w, 3);
    
    // NEW LINE ADDED:
    g.setDepth(4); // Platforms buttons ke upar
    
    const body = scene.add.rectangle(x, y, w, h, 0x000000, 0);
    scene.physics.add.existing(body, true);
    body.setData('visuals', g);
    return body;
},

    createSpike: function(scene, s, visible) {
    const spike = scene.physics.add.staticSprite(s.x, s.y, 'thorn', 0);
    spike.setScale(0.7); spike.setAngle(s.dir * 90);
    
    // Body size code same as before...
    if (s.dir === 0) { spike.body.setSize(40, 20); spike.body.setOffset(12, 20); } 
    else if (s.dir === 2) { spike.body.setSize(40, 20); spike.body.setOffset(12, 15); }
    else if (s.dir === 1) { spike.body.setSize(20, 40); spike.body.setOffset(17, 7); }
    else { spike.body.setSize(20, 40); spike.body.setOffset(25, 7); }
    
    spike.setAlpha(visible ? 1 : 0);
    
    // NEW LINE ADDED:
    spike.setDepth(2); // Spikes door ke upar
    
    this.groups.spikes.add(spike);
},

    createTrollBlock: function(scene, b) {
        const block = this.createBaseWall(scene, b.x, b.y, b.w, b.h);
        block.setAlpha(0);
        this.groups.trollBlocks.add(block);
    },

    createFakeVisualBlock: function(scene, b) {
        const g = scene.add.graphics();
        g.fillStyle(0x2e2e2e); g.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
        g.fillStyle(0x4a4a4a); g.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, 3);
        g.setDepth(4); // Fake block platforms ke upar
    },

    createTempBlock: function(scene, b) {
        const block = this.createBaseWall(scene, b.x, b.y, b.w, b.h);
        block.setData('type', 'temp');
        this.groups.temp.add(block);
    },

    createButton: function (scene, b) {
    const btn = scene.add.sprite(b.x, b.y, 'button');
    btn.setFrame(0);
    btn.setScale(0.2);
    scene.physics.add.existing(btn, true);
    btn.body.setSize(30, 20);
    btn.body.setOffset(35, 41);
    btn.setData('id', b.id);
    btn.setData('target', b.target);
    btn.setData('action', b.action);
    btn.setData('isPressed', false);
    
    // NEW LINE ADDED:
    btn.setDepth(3); // Button spikes ke upar
    
    this.groups.buttons.add(btn);
},

    createSuddenItem: function(scene, item, type) {
        let obj;
        if(type === 'block') {
            obj = this.createBaseWall(scene, item.x, item.y, item.w, item.h);
        } else {
            obj = scene.physics.add.staticSprite(item.x, item.y, 'thorn', 0);
            obj.setScale(0.7); obj.setAngle(item.dir * 90);
            if (item.dir === 0 || item.dir === 2) { obj.body.setSize(40, 20); obj.body.setOffset(12, 20); } 
            else { obj.body.setSize(20, 40); obj.body.setOffset(22, 7); }
        }
        obj.setAlpha(0);
        obj.body.checkCollision.none = true;
        obj.setData('triggerType', item.triggerType || 'distance');
        obj.setData('triggerValue', item.triggerValue || 100);
        obj.setData('triggered', false);
        obj.setData('type', type);
        this.groups.sudden.add(obj);
    },

    createFakeDoor: function(scene, d) {
    const door = scene.add.text(d.x, d.y, '🚪', {
        fontSize: '64px'
    }).setOrigin(0.47);

    door.setScale(1, -1);

    // --- NEW: Rotation Logic Added ---
    if (d.rotation) {
        door.setAngle(d.rotation);
    }
    // ---------------------------------

    scene.physics.add.existing(door, true);

    door.body.setSize(36, 58);
    door.body.setOffset(26, -58);
    // --- 2. ROTATION KE HISAB SE ADJUSTMENTS ---
    if (d.rotation === 180) {
        door.body.setOffset(20, -58); 
    }
    else if (d.rotation === -90) {  
        door.body.setSize(60, 36);  
        door.body.setOffset(11, -48);
    }
    else if (d.rotation === 90 ) {
        door.body.setSize(60, 36); 
        door.body.setOffset(11, -43);
    }
    // --------------------------------------------------

    if (d.id) door.setData('id', d.id);
    if (d.hidden) {
        door.setAlpha(0);
        door.setData('hidden', true);
        door.body.checkCollision.none = true;
    } else {
        door.setData('hidden', false);
    }

    this.groups.fakeDoors.add(door);
    return door;
}
};
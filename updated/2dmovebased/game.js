/*
 * Made my Pontus Laestadius Te2K for a school assignment. Jan 2013-Feb 2013.
 *
 * Updated version was made in August of 2019.
 */

// Texture size
const size = 35;

// Canvas
let c;

// Canvas 2d Context
let ctx;

var go = true;
var lampaAni = 0;
var weaponranks = [1, 1, 1];
var bossdead = false;
var onfirstpause = true;
var dif = 0;
var level = 1;
var gold = 1500;
var multiplayer = false;
var shots = [];
var enemy = [];
var player = [];
var weather = [];
var platform = [];
var boss = [];
var bossdrop = [];
var drop = [];
var shop = [];
var bossprojectile = [];
var chicken = [];
const config = {
    "fps": 30,
    "lang": "language.SV_SE",
    "weather": {
        "max_items": 80
    },
    "font": {
        "title": "50px Helvetica",
        "paragraph": "16px Helvetica"
    },
    "sound": {
        "theme": {
            "urls": [
                "sound/themeSound.mp3",
                "sound/themeSound2.mp3"
            ],
            "autoplay": true,
            "loop": true,
            "volume": 0.03
        },
        "gun": {
            "urls": ['sound/gunfire.ogg'],
            "sprite": {
                vapen3_fire: [300, 120],
                vapen2_fire: [5100, 100],
                vapen1_fire: [12100, 200]
            },
            "volume": 0.1
        },
        "dragon": {
            urls: ['sound/dragon.mp3'],
            sprite: {
                fire: [650, 850]
            },
            volume: 0.05
        },
        "chicken": {
            urls: ['sound/chicken.wav'],
            sprite: {
                spawn1: [432, 400],
                spawn2: [1663, 600]
            },
            volume: 0.05
        }
    },
    "language": {
        "SV_SE": {
            "on_first_pause": "Tryck på den motsvarande upp eller ner knapp för att uppgradera eller negradera dina vapen."
        }
    }
};
const theme = new Howl(config.sound.theme);
const gunSound = new Howl(config.sound.gun);
const dragonSound = new Howl(config.sound.dragon);
const chickenSound = new Howl(config.sound.chicken);
function drawI(img, x, y, w, h) {
    if (!img) {
        ctx.fillRect(x, y, w, h);
        return;
    }
    try {
        ctx.drawImage(img, x, y, w, h);
    } catch (e) {
        ctx.fillRect(x, y, w, h);
    }
}
function initalize() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    window.setInterval(gameloop, 1000/config.fps);
    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
    player.push(new Player());
    platform.push(new Platform());
    Level.set(1);
}
function timeFn(fn) {
    const before = performance.now();
    fn();
    const after = performance.now();
    const duration = after - before;
    if (duration > 500/config.fps) {
        console.warn(`${fn.name} took ${duration} ms`);
    }
}
function gameloop() {
    if(go){
        updatePositions();
        timeFn(repaint);
    } else {
        pause();
    }
}
function clear() {
    ctx.clearRect(0, 0, c.width, c.height);
}
function pause() {
    clear();
    document.body.style.backgroundColor = "#000000";
    ctx.fillStyle="#FFFFFF";
    ctx.font = config.font.title;
    ctx.fillText("Press P to resume", 40, 40);
    ctx.font = config.font.paragraph;
    ctx.fillText("Upgrade Your weapons!", 90, 140);
    ctx.font = config.font.paragraph;
    ctx.fillText("Cash:" + gold, 10, 135);
    for (var i = 1; i <= 3; i++) {
        ctx.fillText(`${100 + 50 * i}G`, 10, 205 + i * 100);
        drawI(eval(`vapen${i}`), 60, 160 + 200 + i * 100);
        drawI(buttonUp, 10, 160 + i * 100, 30, 30);
        drawI(buttonDown, 10, 210 + i * 100, 30, 30);
    }
}
function updatePositions() {
    ([
        bossprojectile,
        bossdrop,
        boss,
        player,
        drop,
        weather,
        chicken,
        shots
    ])
        .forEach(x => x.forEach(y => y.updatePosition()));
}
function repaint() {
    ctx.clearRect(0, 0, c.width, c.height);
    background();
    while (weather.length < config.weather.max_items) {
        new Weather();
    }
    if (level == 2){
        if (Helper.roll(200) === 1){
            new Enemy();
        }
    }
    [
        shots,
        drop,
        enemy,
        bossdrop,
        boss,
        chicken,
        platform,
        shop,
        bossprojectile,
        player,
        weather
    ]
        .forEach(x => x.forEach(y => y.paint(ctx)));
    // Målar ut overlay.
    hud();
}
function background() {
    // Målar ut backgrunden på tredje nivån.
    if (level == 3){
        drawI(window1, 80, 350 - 100, 35, 35);
        drawI(window1, 80 + 160, 350 - 100, 35, 35);
        drawI(window1, 80 + 160 * 2, 350 - 100, 35, 35);
        if (lampaAni >= 1){
            drawI(tLit_2, 0, 350 - 100, 35, 35);
            drawI(tLit_1, 160, 350 - 100, 35, 35);
            drawI(tLit_2, 160 * 2, 350 - 100, 35, 35);
            drawI(tLit_1, 160 * 3, 350 - 100, 35, 35);
        } else {
            drawI(tLit_1, 0, 350 - 100, 35, 35);
            drawI(tLit_2, 160, 350 - 100, 35, 35);
            drawI(tLit_1, 160 * 2, 350 - 100, 35, 35);
            drawI(tLit_2, 160 * 3, 350 - 100, 35, 35);
        }
        lampaAni = lampaAni >= 2 ? 0 : lampaAni + 0.2;
    }
    ground();
}
function hud() {
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0, c.width, 50);
    let this_player = player[0];
    ctx.fillStyle="#FF0000";
    for (var i = 0; i < this_player.health; i++) {
        ctx.fillRect(10 + i * 14, 10, 10, 30);
    }
    ctx.fillStyle="#FFFFFF";
    for (var i = 0; i < player[0].ammo; i++) {
        ctx.fillRect(100 + i * 5, 10, 3, 30);
    }
    for (var i = 0; i < player[0].mag; i++) {
        ctx.fillRect(200 + i * 14, 10, 10, 30);
    }
    ctx.fillStyle="#FFFF00";
    for (var i = 0; i < gold / 100; i++) {
        ctx.fillRect(300 + i * 5, 10, 3, 30);
    }
    drawI(eval(`vapen${this_player.weapon}`), 500, 10, 60, 30);
    ctx.fillStyle="#000000";
}
function keyDown(e){
    if (!player[0]) {
        return;
    }
    switch (e.keyCode) {
    case 88: // X    Reset game, with increased difficulty.
        if (!bossdead) {
            return;
        }
        level = 1;
        bossdead = false;
        dif++;
        for (var i = 0; i < dif; i++) {
            boss.push(new Boss());
        }
        player.forEach(x => {
            x.x = 30;
            x.y = 395;
        });
        break;
    case 77: // M
        if (!multiplayer){
            weaponranks = 1;
            player.push(new Player());
        }
        multiplayer = true;
        break;
    case 87: // W
        if (!multiplayer){ return; }
        if (!player[1].alreadyJumping){ return; }
        player[1].alreadyJumping = true;
        player[1].jumpNow = true;
        break;
    case 70: // F
        if (!multiplayer){ return; }
        player[1].fire();
        break;
    case 68: // D
        if (!multiplayer){ return; }
        player[1].xRight = 2;
        break;
    case 65: // A
        if (!multiplayer){ return; }
        player[1].xLeft = -2;
        break;
    case 66: // B
        player.forEach(x => x.buy());
        break;
    case 84: // Y
        if (!multiplayer){ return; }
        player[1].switchWeaponUp();
        break;
    case 89: // T
        if (!multiplayer){ return; }
        player[1].switchWeaponDown();
        break;
    case 189: // .
        player[0].switchWeaponUp();
        break;
    case 190: // -
        player[0].switchWeaponDown();
        break;
    case 80: // P
        go = !go;
        theme[go ? "play" : "pause"]();
        break;
    case 32: // [[space]]
        player[0].fire();
        break;
    case 39: // ->
        player[0].xRight = 2;
        break;
    case 37: // <-
        player[0].xLeft = -2;
        break;
    case 38: // [[up arrow]]
        let {x,y,w,h, alreadyJumping} = player[0];
        if (alreadyJumping){ return; }
        player[0].alreadyJumping = true;
        player[0].jumpNow = true;
        break;
    }
}
function keyUp(e){
    if (!player[0]) {
        return;
    }
    switch (e.keyCode) {
    case 68: // D
        player[1].xRight = 0;
        break;
    case 65: // A
        player[1].xLeft = 0;
        break;
    case 39: // ->
        player[0].xRight = 0;
        break;
    case 37: // <-
        player[0].xLeft = 0;
        break;
    }
}
function onClick(e){
    if (!player[0]) {
        return;
    }
    const { clientX, clientY } = e;
    if (!go && clientX >= 10 && !multiplayer){
        if (clientY >= 160 && clientY <= 190 && weaponranks[0] < 5 && gold >= 100){
            weaponranks[0] += 1;
            gold -= 100;
        }
        if (clientY >= 160 + 50 && clientY <= 190 + 50 && weaponranks[0] > 1 && gold >= 100){
            weaponranks[0] -= 1;
            gold -= 100;
        }
        if (clientY >= 260 && clientY <= 290 && weaponranks[1] < 5 && gold >= 150){
            weaponranks[1] += 1;
            gold -= 150;
        }
        if (clientY >= 260 + 50 && clientY <= 290 + 50 && weaponranks[1] > 1 && gold >= 150){
            weaponranks[1] -= 1;
            gold -= 150;
        }
        if (clientY >= 360 && clientY <= 390 && weaponranks[2] < 5 && gold >= 200){
            weaponranks[2] += 1;
            gold -= 200
        }
        if (clientY >= 360 + 50 && clientY <= 390 + 50 && weaponranks[2] > 1 && gold >= 200){
            weaponranks[2] -= 1;
            gold -= 200;
        }
    }
}
function ground() {
    let base = grass;
    let center = grassCenter;
    if (level === 3) {
        base = castleMid;
        center = castleCenter;
    }
    for (var i = 0; i <= c.width / size; i++) {
        drawI(base, i*size, c.height -2*size, size, size);
        drawI(center, i*size, c.height -size, size, size);
    }
}
class Enemy {
    constructor() {
        this.x = 100 + Helper.roll(150);
        this.y = 392;
        this.direction = Helper.roll(2);
        this.goldGiven = false;
        this.enemyGoRight = true;
        this.ani = 1;
        this.type = Helper.roll(3);
        if (this.type == 1){
            this.w = 23 / 2;
            this.h = 46 / 2;
            this.y += 46 / 2;
            this.health = 2;
            this.totalHealth = 2;
        }
        if (this.type == 3){
            this.w = 23 * 2;
            this.h = 46 * 2;
            this.y -= 46;
            this.health = 8;
            this.totalHealth = 8;
        }
        if (this.type != 3 && this.type != 1) {
            this.w = 23;
            this.h = 46;
            this.health = 4;
            this.totalHealth = 4;
            this.y = 392;
        }
        this.health += dif;
        this.totalHealth += dif;
        this.levelEnemy = level;
        this.a = 0;
        this.jumpNow = false;
        this.s = 10;
        this.n = 0;
        this.alreadyJumping = false;

        enemy.push(this);
    }
}
Enemy.prototype.updatePosition = function () {
    this.ani = this.ani >= 3.8 ? 1 : this.ani + 0.2;
    if (this.health <= 0){
        if (!this.goldGiven){
            this.goldGiven = true;
            gold += this.type * 5;
            if (Helper.roll(100) >= 20){
                drop.push(new Drop());
            }
        }
        delete this;
        return;
    }
    if (!this.goldGiven){
        this.jumpSpeed = 0.7 + (Math.pow(this.s / 5.2, 2));
        this.jumpSpeed2 = 0.7 + (Math.pow(this.n / 5.2, 2));
        if (this.jumpNow){
            if (this.s >= 0){
                this.s--;
                this.y -= this.jumpSpeed;
            } else {
                this.n++;
                this.y += this.jumpSpeed2;
            }
            if (this.n > 10){
                this.n = 0;
                this.s = 10;
                this.jumpNow = false;
                this.alreadyJumping = false;
            }
        }
        if (this.x >= player[0].x && this.x <= player[0].x + player[0].w && player[0].jumpNow
            && Helper.roll(100) >= 90 && this.type != 3 && this.alreadyJumping == false){
            this.jumpNow = true;
            this.alreadyJumping = true;
        }
        if (this.x < 0 - this.w || this.x > c.width){
            delete this;
            return;
        }
        this.enemyGoRight = Helper.roll(100) > 80;
        this.x += (this.type == 1 ? 4 : 2) * (this.enemyGoRight ? 1 : -1);
    }
    this.a++;
    if (this.a > 30 + Helper.roll(40) && this.health > this.totalHealth - 1 && this.type > 1) {
        this.enemyGoRight = !this.enemyGoRight;
        this.a = 0;
    } else if (this.a > 10 + Helper.roll(40) && this.health > this.totalHealth - 1 && this.type == 1) {
        this.enemyGoRight = !this.enemyGoRight;
        this.a = 0;
    }
};
Enemy.prototype.paint = function (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x - 4, this.y - 10, 31 / 4 * this.totalHealth, 7);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x - 2, this.y - 8, 7 * this.health, 3);
    this.oldD = this.enemyGoRight ? "R" : "L";
    drawI(eval(`enemy1_${Math.floor(this.ani)}${this.oldD}`), this.x, this.y, this.w, this.h);
};
class Weather {
    constructor(options = {}) {
        this.collision = false;
        this.color = "#2E64FE";
        this.direction = false;
        this.levelWeather = level;
        this.lifetime = 0;
        this.radius = Helper.roll(3);
        this.w = this.radius;
        this.speed = 10 + Helper.roll(3) + this.radius;
        this.x = Helper.roll(c.width);
        this.y = Helper.roll(50);
        this.id = Helper.roll(9999);
        Object.entries(options).forEach(([key, val]) => {
            this[key] = val;
        });
        weather.push(this);
    }
}
Weather.prototype.updatePosition = function () {
    if (this.lifetime > config.fps * 2){
        weather.splice(weather.findIndex(x => x.id === this.id), 1);
        delete this;
        return;
    }
    if (this.speed < 5){
        this.direction = Helper.roll(3);
    }
    if (this.y < c.height - size * 2 + Helper.roll(5)){
        this.y += this.speed;
        this.x += this.direction;
    } else {
        this.collision = true;
    }
    if (!this.collision) {
        this.collision = this.collision_objects().some(x => x.y <= this.y && x.y + x.h >= this.y && this.x >= x.x && x.x + x.w >= this.x)
    } else {
        this.w *= 1.1;
        this.radius = Math.min(1, this.radius - 0.1);
        this.speed = 0;
        this.lifetime += 10;
    }
};
Weather.prototype.collision_objects = function () {
    return [
        ...platform,
        ...drop,
        ...player
    ];
}
Weather.prototype.paint = function (ctx) {
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x - this.w/2, this.y, this.w, this.radius);
};
class Drop {
    constructor(options = {}) {
        Object.assign(this, options);
        if (level != 3){
            this.x = enemy[v[1]].x + enemy[v[1]].w / 2 - 7;
            this.y = 420;
        } else {
            this.x = 50 + Helper.roll(400);
            this.y = 200;
        }
        this.w = 15;
        this.h = 15;
        this.type = Helper.roll(5);
        this.blink = 0;
        this.levelBox = level;
    }
}
Drop.prototype.updatePosition = function () {
    this.blink = this.blink > 4 ? 0 : this.blink + 0.05;
    if (player[0].x + player[0].w >= this.x && player[0].x <= this.x + 10
        && player[0].y + player[0].h >= this.y + 10 && player[0].y + player[0].h >= this.y + this.h){
        delete this;
        return;
        if (this.type == 1){
            player[0].weapon1[1]++;
        }
        if (this.type == 2){
            player[0].weapon2[1]++;
        }
        if (this.type == 3){
            player[0].weapon3[1]++;
        }
        if (this.type == 4){
            player[0].health += 2;
        }
        if (this.type == 5){
            player[0].gotWeapon2 = true;
        }
    }
};
Drop.prototype.paint = function (ctx) {
    if (this.type < 4) {
        drawI(eval(`box${this.type}`), this.x, this.y, this.w, this.h);
    } else if (this.type == 4) {
        drawI(vapen3_player, this.x, this.y, this.w, this.h - 5);
    } else if (this.type >= 5) {
        drawI(vapen2_player, this.x, this.y, this.w, this.h - 5);
    }
    if (this.blink >= 2){
        ctx.fillStyle="#FFFF00";
        ctx.fillRect(this.x, this.y, this.w / 12, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h / 12);
        ctx.fillRect(this.x + this.w - this.w / 12, this.y, this.w / 12, this.h);
        ctx.fillRect(this.x, this.y + this.h - this.h / 12, this.w, this.h / 12);
    }
};
class Shop {
    constructor(options = {}) {
        Object.assign(this, options);
        shop.push(this);
    }
}
Shop.prototype.paint = function (ctx) {
    ctx.fillStyle="#000000";
    ctx.fillText(`${this.price}`,this.x, this.y - 43);
    drawI(this.icon,this.x - 10, this.y - 40, 60, 20);
    if (player[0].gotWeapon3){
        drawI(doorMid, this.x, this.y, 35, 35);
        drawI(doorTop, this.x, this.y - 35, 35, 35);
    } else {
        drawI(doorMidClosed, this.x, this.y, 35, 35);
        drawI(doorTopClosed, this.x, this.y - 35, 35, 35);
    }
};

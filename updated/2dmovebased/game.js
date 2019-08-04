/*
 * Made my Pontus Laestadius Te2K for a school assignment. Jan 2013-Feb 2013.
 *
 * Updated version was made in August of 2019.
 *
 * Player:
 * https://rvros.itch.io/animated-pixel-hero
 *
 * Background:
 * https://edermunizz.itch.io/free-pixel-art-forest
 *
 */

// Canvas
let c;

// Canvas 2d Context
let ctx;

var go = true;
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
    "fps": 40,
    "lang": "language.SV_SE",
    "weather": {
        "max_items": 50
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

    window.setInterval(() => timeFn(gameloop), 1000/config.fps);
    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = 180;
        updateLayers();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
    player.push(new Player());
    Level.set(1);
}

let pv = null;
function updateLayers(dx = 0) {
    if (Math.floor(dx) == Math.floor(pv)) {
        return;
    }
    pv = dx;
    let c2 = document.getElementById("layer2");
    let ctx2 = c2.getContext("2d");
    c2.width = c.width;
    c2.height = c.height + 200;
    let offset = -150;
    let h = 500;
    let w = 600;

    let drawer = (img, ratio = 1) => {
        for (var i = -w*2; i < c.width * 2; i += w) {
            ctx2.drawImage(img, i + (dx * ratio) % w, offset, w +2, h);
        }
    }

    drawer(top_layer, 0.5);
    drawer(layer_83, 0.1);
    drawer(middle_layer, 0.15);
    drawer(layer_7L, 0.15);
    drawer(bottom_layer, 1.5);
}
function timeFn(fn) {
    const before = performance.now();
    fn();
    const after = performance.now();
    const duration = after - before;
    if (duration > (1000 / config.fps) / 2) {
        console.warn(`${fn.name} took ${duration} ms`);
        // If the game loop is too slow, we reduce the number of unnecessery particles.
        if (config.max_items > 0) {
            config.max_items--;
        }
    }
}
function gameloop() {
    if(go){
        updatePositions();
        repaint();
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
}
function keyDown(e){
    if (!player[0]) {
        return;
    }
    player[0].keyDown(e);
    switch (e.keyCode) {
    case 80: // P
        go = !go;
        theme[go ? "play" : "pause"]();
        break;
    }
}
function keyUp(e){
    if (!player[0]) {
        return;
    }
    player[0].keyUp(e);
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
        this.dx = -(10 + Helper.roll(5));
        this.h = 1 + Helper.roll(2);
        this.w = this.h -1;
        this.x = Helper.roll(c.width);
        this.y = Helper.roll(c.height/2);
        this.id = Helper.roll(9999);
        this.lifetime = 0;
        this.speed = 200 / config.fps;
        weather.push(this);
    }
}
Weather.prototype.updatePosition = function () {
    if (this.lifetime > config.fps ||
        Math.floor(this.h) === 0 ||
        Math.floor(this.h) === 0){
        weather.splice(weather.findIndex(x => x.id === this.id), 1);
        delete this;
        return;
    }
    if (this.y > c.height - 10) {
        this.collision = true;
    }
    if (!this.collision) {
        this.y += this.speed;
        this.x += this.dx;
        let {x, y, w, h} = player[0];
        w -= 40;
        x += 30;
        h += 25;
        y += 5;

        if (this.y > y && this.y < y+h && this.x > x && this.x  < x + w) {
            this.collision = 'player';
        }
    } else if (this.collision == 'player') {
        this.w += 0.3;
        this.h *= 1.1;
        this.y += this.speed / 5;
        this.x += this.dx /10;
        this.lifetime += this.speed * 2;
    } else {
        this.w *= 1.2;
        this.h -= 0.3;
        this.lifetime += this.speed;
    }
};
Weather.prototype.paint = function (ctx) {
    ctx.fillStyle=`rgb(0, 0, ${200 - this.lifetime * 3})`;
    ctx.fillRect(this.x - this.w/2, this.y, this.w, this.h);
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
    ctx.fillRect(this.x, this.y, 35, 35);
};

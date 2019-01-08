var c, ctx;

player = [];
player[0] = new Player();

enemy = [];
var enemyCounter = 0;
var e = 0;

projectile = [];
var pr = 0;

var maxWarpTime = 140;
var warpingDurating = 30;
var score = 0;
var backgroundRotation = [0, 0];


function run() {
  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");
  window.setInterval(gameloop, 10);
  window.setInterval(timeloop, warpingDurating);
  window.setInterval(enemyUpdater, 10);
  window.setInterval(projectileupdater, 10);

  for (var i = 30; i > -1; i--){
    player[0].saveX[i] = 100;
    player[0].saveY[i] = 100;
  }
}

function gameloop() {
  updatePosition();
  repaint();
}

function updatePosition() {
  player[0].updatePosition();

  document.getElementById("score").innerHTML = "Score: " + score;

  if (enemyCounter > 14 - score/50 && player[0].warping == false){
    enemy.push(new Enemy());
    enemyCounter = 0;
  } else {
    enemyCounter++;
  }

  if (player[0].warping == true){
    backgroundRotation[0] += (1 + score/40) / 2;
    backgroundRotation[1] -= 0;

  } else {
    backgroundRotation[0] -= (1 + score/40) / 2;
    backgroundRotation[1] += 0;
  }

  if (backgroundRotation[0] <= - 500){
    backgroundRotation[0] = 0;
  }

  if (backgroundRotation[1] <= - 500){
    backgroundRotation[1] = 0;
  }
}

function repaint() {
  ctx.clearRect(0, 0, 500, 500);

  ctx.drawImage(bg, backgroundRotation[0], backgroundRotation[1], 500, 500);
  ctx.drawImage(bg, backgroundRotation[0] + 500, backgroundRotation[1], 500, 500);
  ctx.drawImage(bg, backgroundRotation[0] + 500, backgroundRotation[1] + 500, 500, 500);
  ctx.drawImage(bg, backgroundRotation[0], backgroundRotation[1] + 500, 500, 500);
  ctx.drawImage(bg, backgroundRotation[0] - 500, backgroundRotation[1], 500, 500);
  ctx.drawImage(bg, backgroundRotation[0] - 500, backgroundRotation[1] - 500, 500, 500);
  ctx.drawImage(bg, backgroundRotation[0], backgroundRotation[1] - 500, 500, 500);

  player[0].paint(ctx);

  ctx.fillStyle="black";

  for (e in enemy){
    enemy[e].paint(ctx);
  }
}

function enemyUpdater() {
  for (e in enemy){
    enemy[e].updatePosition();
  }
}

function projectileupdater() {
  for (pr in projectile){
    projectile[pr].paint(ctx);
    projectile[pr].updatePosition();
  }
}

function timeloop() {
  player[0].timeloop();

  for (e in enemy){
    enemy[e].timeloop();
  }
}

function keyDown(e){
  if (player[0].warping == false){
    //Upp
    if(e.keyCode == 38){
      player[0].up = 3;
    }

    //Ner
    if(e.keyCode == 40){
      player[0].down = 3;
    }

    //Vänster
    if(e.keyCode == 37){
      player[0].Xleft = 3;
    }

    //Höger
    if(e.keyCode == 39){
      player[0].Xright = 3;
    }

    //Shift
    if(e.keyCode == 16){
      player[0].warp();
      for (e in enemy){
        enemy[e].warp();
      }
    }

    if (e.keyCode == 32){
      projectile.push(new Projectile());
    }
  }
}

function keyUp(e){

  //Upp
  if(e.keyCode == 38){
    player[0].releaseUp = 3;
  }

  //Ner
  if(e.keyCode == 40){
    player[0].releaseDown = 3;
  }

  //Vänster
  if(e.keyCode == 37){
    player[0].releaseLeft = 3;
  }

  //Höger
  if(e.keyCode == 39){
    player[0].releaseRight = 3;
  }

}

function Player(x, y, w, h, timeX, timeY, saveX, saveY, Xleft, Xright, up, down, warping, counter1, k, life,
  cooldown, nodamage, releaseLeft, releaseRight, releaseUp, releaseDown) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.timeX = timeX;
  this.timeY = timeY;
  this.saveX = saveX;
  this.saveY = saveY;
  this.Xleft = Xleft;
  this.Xright = Xright;
  this.up = up;
  this.down = down;
  this.warping = warping;
  this.counter1 = counter1;
  this.k = k;
  this.life = life;
  this.cooldown = cooldown;
  this.nodamage = nodamage;
  this.releaseLeft = releaseLeft;
  this.releaseRight = releaseRight;
  this.releaseUp = releaseUp;
  this.releaseDown = releaseDown;

  this.x = 100;
  this.y = 100;
  this.w = 20;
  this.h = this.w;
  this.timeX = [];
  this.timeY = [];
  this.saveX = [];
  this.saveY = [];
  this.Xleft = 0;
  this.Xright = 0;
  this.up = 0;
  this.down = 0;
  this.warping = false;
  this.counter1 = 0;
  this.k = 0;
  this.life = 3;
  this.cooldown = 0;
  this.nodamage = 0;
  this.releaseLeft = 0;
  this.releaseRight = 0;
  this.releaseUp = 0;
  this.releaseDown = 0;
}

Player.prototype.warp = function () {
  this.warping = true;
  this.x = this.timeX[0];
  this.y = this.timeY[0];

};

Player.prototype.timeloop = function () {

  for (var i = 0; i < maxWarpTime; i++){
    if (this.timeX.length >= maxWarpTime){
      this.timeX[((maxWarpTime - 1) - i)] = this.saveX[(this.saveX.length - i)];
    }
  }
  this.timeX.length = maxWarpTime;

  this.timeX[this.timeX.length] = this.x;
  this.saveX[this.saveX.length] = this.x;

  for (var i = 0; i < maxWarpTime; i++){
    if (this.timeY.length >= maxWarpTime){
      this.timeY[((maxWarpTime -1) - i)] = this.saveY[(this.saveY.length - i)];
    }
  }
  this.timeY.length = maxWarpTime;

  this.timeY[this.timeY.length] = this.y;
  this.saveY[this.saveY.length] = this.y;

};

Player.prototype.updatePosition = function () {
  this.counter1 += 1;

  if (this.counter1 >= 30){
    this.counter1 = 0;
  }

  if (this.releaseLeft > 0){
    this.releaseLeft -= 0.5;
    if (this.Xleft > 0){
      this.Xleft -= 1;
    }
  }

  if (this.releaseRight > 0){
    this.releaseRight -= 0.5;
    if (this.Xright > 0){
      this.Xright -= 1;
    }
  }

  if (this.releaseUp > 0){
    this.releaseUp -= 0.5;
    if (this.up > 0){
      this.up-= 1;
    }
  }

  if (this.releaseDown > 0){
    this.releaseDown -= 0.5;
    if (this.down > 0){
      this.down -= 1;
    }
  }

  if (this.cooldown > 0){
    this.cooldown++;
    if (this.cooldown > 20){
      this.cooldown = 0;
    }
  }

  this.x += -this.Xleft +this.Xright;
  this.y += -this.up +this.down;

  if (this.life < 1){
    delete player[0];
    delete enemy[e];
  }


  if (this.x > 500){
    this.x = this.w / 2;
  }

  if (this.y > 500){
    this.y = this.h / 2;
  }

  if (this.x < 0 - this.w){
    this.x = 500 - this.w / 2;
  }

  if (this.y < 0 - this.h){
    this.y = 500 - this.h / 2;
  }


  if (this.warping == true && this.k < (maxWarpTime + 1)){
    this.x = this.timeX[(maxWarpTime - this.k)];
    this.y = this.timeY[(maxWarpTime - this.k)];
    this.k += 1;
  } else if (this.warping == true) {
    this.k = 0;
    this.warping = false;
    this.cooldown = 1;
  }
};

Player.prototype.paint = function (ctx) {

  if (this.cooldown > 0) {
    if (this.nodamage == 1) {
      ctx.drawImage(spelare, this.x, this.y, this.w, this.h);
    }

    this.nodamage++;

    if (this.nodamage > 1) {
      this.nodamage = 0;
    }

  } else {
    ctx.drawImage(spelare, this.x, this.y, this.w, this.h);
  }

  if (this.counter1 < 10) {
    ctx.drawImage(aniOne, this.x - this.w, this.y);
  } else if (this.counter1 >= 10 && this.counter1 < 20){
    ctx.drawImage(aniTwo, this.x - this.w, this.y);
  } else if (this.counter1 >= 20 && this.counter1 < 30){
    ctx.drawImage(aniThree, this.x - this.w, this.y);
  }
};

function Enemy(x, y, w, h, timeX, timeY, saveX, saveY, warping, k, type, speed) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.timeX = timeX;
  this.timeY = timeY;
  this.saveX = saveX;
  this.saveY = saveY;
  this.warping = warping;
  this.k = k;
  this.type = type;
  this.speed = speed;

  this.speed = 1 + score/40;
  this.x = 600 + this.speed * 20;
  this.y = Math.round(Math.random() * 490);
  this.w = 40;
  this.h = 20;
  this.timeX = [];
  this.timeY = [];
  this.saveX = [];
  this.saveY = [];
  this.warping = false;
  this.k = 0;
  this.type = Math.round(Math.random()*100);

  if (this.type < 33){
    this.speed += 2;
  } else if (this.type >= 33 && this.type < 63){
  } else if (this.type >= 63){
    this.speed += 1;
  }
}

Enemy.prototype.updatePosition = function () {

  if (this.type < 33){
    this.w = 20;
    this.h = 10;
  } else if (this.type >= 33 && this.type < 63){
    this.h = 40;
    this.w = 10;
  } else if (this.type >= 63){
    this.w = 40;
    this.h = 20;
  }

  if (this.x < -(150 + 12 * score)){
    delete enemy[e];
    score++;
  }

  if (this.x <= player[0].x + player[0].w && this.x + this.w >= player[0].x && this.y + this.h >= player[0].y
    && player[0].y + player[0].h >= this.y && player[0].warping == false && player[0].cooldown == 0 && player[0].life > 0){
    player[0].warp();
    for (e in enemy){
      enemy[e].warp();
    }
    player[0].life--;
  }

  this.x -= this.speed;

  if (this.warping == true && this.k < (maxWarpTime + 1)){
    this.x = this.timeX[(maxWarpTime - this.k)];
    this.y = this.timeY[(maxWarpTime - this.k)];
    this.k += 1;
  } else if (this.warping == true) {
    this.k = 0;
    this.warping = false;
  }
};

Enemy.prototype.paint = function (ctx) {

  if (this.type < 33){
    ctx.drawImage(pink, this.x, this.y, this.w, this.h);
  } else if (this.type >= 33 && this.type < 63){
    ctx.drawImage(wall, this.x, this.y, this.w, this.h);
  } else if (this.type >= 63){
    ctx.drawImage(orange, this.x, this.y, this.w, this.h);
  }


  if (this.x > 500){
    ctx.fillStyle="red";
    ctx.fillRect((500 +(500-this.x) / 4), this.y, (this.x - 500), this.h);
  }
  ctx.fillStyle="black";
};

Enemy.prototype.timeloop = function () {

  for (var i = 0; i < maxWarpTime; i++){
    if (this.timeX.length >= maxWarpTime){
      this.timeX[((maxWarpTime - 1) - i)] = this.saveX[(this.saveX.length - i)];
    }
  }
  this.timeX.length = maxWarpTime;

  this.timeX[this.timeX.length] = this.x;
  this.saveX[this.saveX.length] = this.x;

  for (var i = 0; i < maxWarpTime; i++){
    if (this.timeY.length >= maxWarpTime){
      this.timeY[((maxWarpTime -1) - i)] = this.saveY[(this.saveY.length - i)];
    }
  }
  this.timeY.length = maxWarpTime;

  this.timeY[this.timeY.length] = this.y;
  this.saveY[this.saveY.length] = this.y;
};

Enemy.prototype.warp = function () {
  this.warping = true;
  this.x = this.timeX[0];
  this.y = this.timeY[0];
};

function Projectile(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.x = player[0].x + player[0].w;
  this.y = player[0].y + player[0].h / 2;
  this.w = 6;
  this.h = 6;
}

Projectile.prototype.updatePosition = function () {
  this.x += 1;
};

Projectile.prototype.paint = function (ctx) {

  ctx.drawImage(projectile_1, this.x, this.y - this.h/2, this.w, this.h)

};

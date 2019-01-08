var enemy = [];
var e = 0;

var player = [];
var p = 0;

var cannon = [];
var c = 0;


function Player(x, y, w, h, v, transition, transitionSpeed, displayX, displayY, onload){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.v = v;
  this.transition = transition;
  this.transitionSpeed = transitionSpeed;
  this.displayX = displayX;
  this.displayY = displayY;
  this.onload = onload;

  this.w = 16;
  this.h = 16;
  this.v = [0, 0, 0, 0];
  this.transition = [0, 0, 0, 0];
  this.transitionSpeed = 2;
  this.onload = true;
}

Player.prototype.paint = function (ctx) {
  ctx.drawImage(player_1, this.x * boardSize - this.w / 8, this.y * boardSize - this.w / 8, this.w + this.w / 4, this.h + this.h / 4);
  //ctx.drawImage(player_1, this.displayX * boardSize - this.w / 8, this.displayY * boardSize - this.w / 8, this.w + this.w / 4, this.h + this.h / 4);
};

Player.prototype.update = function () {

  if (this.onload == true){
    this.displayX = this.x;
    this.displayY = this.y;
    this.onload = false;
  }

  if (this.transition[1] != 0){

    if (Math.round(this.displayX) == this.displayX){

      if (this.transition[1] > 0 && map1[Math.round(this.displayY)][Math.round(this.displayX) +1] < 1){
        this.displayX += 1 / this.transitionSpeed;
        this.transition[1]--;
      }

      if (this.transition[1] < 0 && map1[Math.round(this.displayY)][Math.round(this.displayX) -1] < 1){
        this.displayX -= 1 / this.transitionSpeed;
        this.transition[1]++;
      }

    } else {

      if (this.transition[1] > 0 && map1[Math.round(this.displayY)][this.displayX +0.5] < 1){
        this.displayX += 1 / this.transitionSpeed;
        this.transition[1]--;
      }

      if (this.transition[1] < 0 && map1[Math.round(this.displayY)][this.displayX -0.5] < 1){
        this.displayX -= 1 / this.transitionSpeed;
        this.transition[1]++;
      }

    }


  }

  if (this.transition[3] != 0){

    if (Math.round(this.displayY) == this.displayY){

      if (this.transition[3] > 0 && map1[Math.round(this.displayY) +1][Math.round(this.displayX)] < 1){
        this.displayY += 1 / this.transitionSpeed;
        this.transition[3]--;
      }

      if (this.transition[3] < 0 && map1[Math.round(this.displayY) -1][Math.round(this.displayX)] < 1){
        this.displayY -= 1 / this.transitionSpeed;
        this.transition[3]++;
      }

    } else {

      if (this.transition[3] > 0 && map1[this.displayY +0.5][Math.round(this.displayX)] < 1){
        this.displayY += 1 / this.transitionSpeed;
        this.transition[3]--;
      }

      if (this.transition[3] < 0 && map1[this.displayY -0.5][Math.round(this.displayX)] < 1){
        this.displayY -= 1 / this.transitionSpeed;
        this.transition[3]++;
      }

    }


  }

  console.clear();
  console.log(this.transition);


  if (this.v[0] == 1 && map1[this.y][this.x +1] < 1){
    this.x += speed;
    this.transition[1] += this.transitionSpeed;
  }

  if (this.v[1] == 1 && map1[this.y][this.x -1] < 1){
    this.x -= speed;
    this.transition[1] -= this.transitionSpeed;
  }

  if (this.v[2] == 1 && map1[this.y -1][this.x] < 1){
    this.y -= speed;
    this.transition[3] -= this.transitionSpeed;
  }

  if (this.v[3] == 1 && map1[this.y +1][this.x] < 1){
    this.y += speed;
    this.transition[3] += this.transitionSpeed;
  }
};

function Cannon(x, y, w, h,shoot){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.shoot = shoot;

  this.w = 16;
  this.h = 16;
  this.shoot = [0, 0];
}

Cannon.prototype.update = function () {
  this.shoot[0]++;

  if (slumpa(100) > 50){
    this.shoot[0]++;
  }

  if (this.shoot[0] > 70){
    this.shoot[0] = 0;
  }
};

Cannon.prototype.paint = function () {



  //ctx.fillStyle="blue";
  //ctx.rect(this.x*boardSize, this.y*boardSize, boardSize, boardSize);

  ctx.drawImage(tiles1, this.x*boardSize, this.y*boardSize, boardSize, boardSize);
  ctx.drawImage(tiles1_cannon_fire, this.x*boardSize, this.y*boardSize, boardSize, boardSize);

  if (this.shoot[0] >= 50){
    ctx.fillStyle="red";

    // y
    //ctx.fillRect(this.x*boardSize, (this.y - 2)*boardSize, this.w, this.h * 5);

    // x
    if (map1[this.y][this.x +2] == 0 && map1[this.y][this.x +1] == 0){
      ctx.fillRect((this.x + 1)*boardSize, this.y*boardSize, this.w * 2, this.h);

    } else if (map1[this.y][this.x +1] == 0){
      ctx.fillRect((this.x + 1)*boardSize, this.y*boardSize, this.w, this.h);


    }

    if (map1[this.y][this.x -2] == 0 && map1[this.y][this.x -1] == 0){
      ctx.fillRect((this.x -2)*boardSize, this.y*boardSize, this.w * 2, this.h);

    } else if (map1[this.y][this.x -1] == 0){
      ctx.fillRect((this.x -1)*boardSize, this.y*boardSize, this.w, this.h);


    }
  }
};

function Enemy(x, y, w, h, d){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.d = d;

  this.x = slumpa(map1.length);
  this.y = slumpa(map1.length);
  this.w = 16;
  this.h = 16;
  this.d = [0, 0];
}

Enemy.prototype.updatePosition = function () {
  if (this.d[0] == 0 && slumpa(100) > 90){
    if (slumpa(100) > 50){
      if (slumpa(100) > 50){
        if(map1[this.y][this.x +1] ==0){
          this.x++;
        }
      } else {
        if(map1[this.y -1][this.x] ==0){
          this.y--;
        }
      }
    } else {
      if (slumpa(100) > 50){
        if(map1[this.y +1][this.x] ==0){
          this.y++;
        }
      } else {
        if(map1[this.y][this.x -1] ==0){
          this.x--;
        }
      }
    }

    this.d[0]++;
  } else {
    this.d[1]++;
  }

  if (this.d[1] > 10){
    this.d = [0, 0];
  }
};

Enemy.prototype.paint = function (ctx) {
  ctx.fillStyle="blue";
  ctx.fillRect(this.x * boardSize + 2, this.y * boardSize + 2, this.w, this.h);

};

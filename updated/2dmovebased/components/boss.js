
class Boss {
    constructor() {
        this.x = 200;
        this.y = 200;
        this.w = 74;
        this.h = 54;
        this.direction = Helper.roll(6);
        this.timer = 0;
        this.shootDelay = false;
        this.counter1 = 0;
        this.health = 20;
        this.doOnce = false;
        this.makeLazor = false;
        this.initLazor = 0;
        this.facingRight = true;
        this.ani = 0;
        this.soundtimer = 0;
        this.damageSize = 0;
        this.movefaster = 0;
    }
}

Boss.prototype.updatePosition = function () {

    for (v[4] in player){

        if (this.x <= player[v[4]].x + player[v[4]].w && this.x + this.w >= player[v[4]].x && Helper.roll(50) == 1
            && this.shootDelay == false){
            this.makeLazor = true;
        }

        if (this.x + 25 <= player[v[4]].x + player[v[4]].w && this.x + this.w >= player[v[4]].x + 25 && this.shootDelay == false
            && this.initLazor >= 10 && !player[v[4]].damageDelay){
            player[v[4]].health--;
            player[v[4]].damageDelay = true;
        }
    }
    this.ani++;

    if (this.ani >= 16){
        this.ani = 0;
        this.h = 54;
        this.y += 10;
    }

    if (this.ani == 4){
        this.w += 5;
        this.h += 6;
    } else if (this.ani == 8){
        this.w -= 5;
        this.h -= 6;
    } else if (this.ani == 12){
        this.h += 26;
        this.y -= 10;
    }

    if (this.health < 20 && dif > 0){
        this.damageSize = 20 - this.health;
    } else {
        this.damageSize = 0;
    }

    for (v[4] in player){

        if (player[v[4]].x > this.x && this.facingRight == false){
            this.movefaster = 15;
        } else if (this.x > player[v[4]].x && this.facingRight){
            this.movefaster = 15;
        }


        if (this.x < player[v[4]].x && this.facingRight){
            this.movefaster = 0;
            if (Helper.roll(1000) > 850 && level == 3){
                bossprojectile.push(new Bossprojectile());
                if (this.soundtimer == 0){
                    dragonSound.play('fire');
                    this.soundtimer = 1;
                }
            }
        } else if (this.x > player[v[4]].x && this.facingRight == false){
            this.movefaster = 0;
            if (Helper.roll(1000) > 850 && level == 3){
                bossprojectile.push(new Bossprojectile());
                if (this.soundtimer == 0){
                    dragonSound.play('fire');
                    this.soundtimer = 1;
                }
            }
        }
    }

    if (this.soundtimer >= 850 + 50 / 30){
        this.soundtimer = 0;
    } else if (this.soundtimer > 0) {
        this.soundtimer++;
    }

    this.hitYourLazer = 375 - this.y;

    for (v[5] in shots){
        if (shots[v[5]].x >= this.x && shots[v[5]].x <= this.x + 40 && this.y <= shots[v[5]].y && shots[v[5]].y <= this.y + 60){
            this.health -= shots[v[5]].damage;
            if (dif > 0){
                this.w -= this.damageSize;
                this.h -= (this.damageSize / (74/54));
            }
            delete shots[v[5]];
        }

    }

    if (this.initLazor > 30){
        this.initLazor = 0;
        this.makeLazor = false;
    }

    // Vid död.
    if (this.health < 1){
        delete boss[v[6]];
        drop.push(new Drop());
        drop.push(new Drop());
        drop.push(new Drop());
        drop.push(new Drop());
        drop.push(new Drop());
        drop.push(new Drop());
        gold += 300;
        alert("To increase the difficulty and restart, Press X.");
        bossdead = true;
    }

    // Döda boss drop
    if (Helper.roll(300) == 1){
        bossdrop.push(new Bossdrop());
    }

    if (this.shootDelay){
        this.counter1++;

        if (this.counter1 > 30){
            this.shootDelay = false;
            this.counter1 = 0;
        }
    }

    if (level != 3){
        this.x = -500;
        this.y = -500;
        this.doOnce = false;
    } else if (this.doOnce == false) {
        this.x = 200;
        this.y = 200;
        this.doOnce = true;
    }

    if (this.timer > 50 - dif * 7 - this.movefaster){
        this.direction = Helper.roll(6);
        this.timer = 0;
    }

    this.timer++;

    if (this.y < 200 && this.direction < 3 ){
        this.y++;
    }

    if (this.direction == 1 && this.x >= 20){
        this.x -= 3;
        this.facingRight = false;
    }

    if (this.direction == 2 && this.x <= 480 - this.w){
        this.x += 3;
        this.facingRight = true;
    }

    if (this.direction == 3 && this.y >= 70){
        this.y -= 3;
    }

    if (this.direction == 4 && this.y <= 300){
        this.y += 3;
    }

    if (this.direction == 5 && this.y >= 70 && this.x >= 20){
        this.y -= 3;
        this.x -= 3;
        this.facingRight = false;
    }

    if (this.direction == 6 && this.y <= 300 && this.x <= 480 - this.w){
        this.y += 3;
        this.x += 3;
        this.facingRight = true;
    }
};

Boss.prototype.paint = function () {
    if (dif === 0){
        ctx.fillStyle="#000000";
        ctx.fillRect(35, 66, 20 * 20 + 8, 19);

        ctx.fillStyle="#FF0000";
        ctx.fillRect(39, 70, 20 * this.health, 11);
    }

    ctx.fillStyle="#F3F781";

    if (this.makeLazor && this.initLazor >= 10){
        ctx.fillRect(this.x + this.w / 2 - 15, this.y + 60, 30, this.hitYourLazer);
    }

    if (this.makeLazor){
        this.initLazor++;
        ctx.fillRect(this.x + this.w / 2 - 5, this.y + 60, 10, this.hitYourLazer);
    }

    if (this.facingRight){
        if (this.ani < 4){
            drawI(boss1_right1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 8){
            drawI(boss1_right2,this.x, this.y, this.w, this.h);

        } else if (this.ani < 12){
            drawI(boss1_right1,this.x, this.y, this.w, this.h);

        } else if (this.ani < 16){
            drawI(boss1_right3,this.x, this.y, this.w, this.h);
        }
    } else {
        if (this.ani < 4){
            drawI(boss1_left1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 8){
            drawI(boss1_left2,this.x, this.y, this.w, this.h);
        } else if (this.ani < 12){
            drawI(boss1_left1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 16){
            drawI(boss1_left3,this.x, this.y, this.w, this.h);
        }
    }
};

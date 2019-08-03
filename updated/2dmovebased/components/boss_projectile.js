class Bossprojectile {
    constructor() {
        this.h = 20;
        this.w = 20;
        this.collision = false;
        this.lifetime = 0;
        this.ani = Helper.roll(20);

        this.x = boss[0].x;
        this.y = boss[0].y + boss[0].h / 2;

        if (boss[0].facingRight){
            this.direction = 1;
            this.x += boss[0].w - this.w;
        } else {
            this.direction = 0;
        }
        if (player[0].y < c.height - 35 * 4){
            this.ignorePlatform = false;
        } else {
            this.ignorePlatform = true;
        }
    }
}

Bossprojectile.prototype.updatePosition = function () {
    this.ani = this.ani > 19 ? 0 : this.ani +2;

    if (level != 3){
        delete bossprojectile[v[9]];
    }

    for (v[4] in player){
        if (player[v[4]].x + player[v[4]].w >= this.x && player[v[4]].x <= this.x + 10 && player[v[4]].damageDelay == false
            && player[v[4]].y <= this.y + this.h && player[v[4]].y + player[v[4]].h > this.y){
            delete bossprojectile[v[9]];

            player[v[4]].health--;
            player[v[4]].damageDelay = true;
        }
    }

    if (this.y > 410){
        this.collision = true;
    }

    for (v[3] in platform){
        if (this.x + this.w > platform[v[3]].x + 3 && this.x < platform[v[3]].x + platform[v[3]].w - 3 && this.y + this.h >= platform[v[3]].y
            && this.y + this.h < platform[v[3]].y + 5 && this.collision == false && this.ignorePlatform == false){
            this.collision = true;

        }  else if (this.y < 420 && !this.collision) {
            this.y += 4;
            this.x += this.direction ? 3 : -3;

        } else if (this.collision){
            this.lifetime++;
            if (this.lifetime > 10){
                delete bossprojectile[v[9]];
            }
        }
    }
}

Bossprojectile.prototype.paint = function (ctx) {
    let img;
    if (this.direction === 1){
        if (this.ani >= 10){
            img = bossprojectile_right;
        } else {
            img = bossprojectile_right_2;
        }
    } else {
        if (this.ani >= 10){
            img = bossprojectile_left;
        } else {
            img = bossprojectile_left_2;
        }
    }
    drawI(img, this.x, this.y, this.w, this.h);
};

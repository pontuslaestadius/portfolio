
class Bossdrop {
    constructor() {
        this.w = 23;
        this.h = 33;
        this.fallingSpeed = 1 + Helper.roll(4);
        this.lifetime = 0;
        this.falling = true;

        for (v[6] in boss){
            this.x = boss[v[6]].x + boss[v[6]].w / 2;
            this.y = boss[v[6]].y + boss[v[6]].h - this.h;
        }
    }
}

Bossdrop.prototype.paint = function () {
    drawI(bossdropImage, this.x, this.y);
    if (this.lifetime > 75){
        drawI(crack3, this.x, this.y);
    } else if (this.lifetime > 50){
        drawI(crack2, this.x, this.y);
    } else if (this.lifetime > 25){
        drawI(crack1, this.x, this.y);
    }
};

Bossdrop.prototype.updatePosition = function () {

    if (this.lifetime > 100){

        chicken.push(new Chicken());

        delete bossdrop[v[7]];
    }

    if (level != 3){
        delete bossdrop[v[7]];
    }

    for (v[4] in player){
        if (player[v[4]].x + player[v[4]].w >= this.x && player[v[4]].x < this.x + this.w && this.y + this.h >=
            player[v[4]].y && this.y <= player[v[4]].y + player[v[4]].h){
            delete bossdrop[v[7]];
            for (v[6] in boss){
                boss[v[6]].health--;
                if (dif > 0){
                    this.w -= this.damageSize;
                    this.h -= (this.damageSize / (74/54));
                }
            }
        }
    }

    for (v[3] in platform){
        if (this.x + this.w >= platform[v[3]].x && this.x <= platform[v[3]].x + platform[v[3]].w && this.y + this.h >= platform[v[3]].y){
            this.falling = false;
        }
    }

    if (this.y < 400 && this.falling){
        this.y += this.fallingSpeed;
    } else {
        this.lifetime++;
    }
};

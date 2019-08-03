class Chicken {
    constructor() {
        for (v[7] in bossdrop){
            this.x = bossdrop[v[7]].x;
            this.y = bossdrop[v[7]].y;
        }
        this.w = 36;
        this.h = 25;
        this.direction = Helper.roll(2);
        this.va = [0, 0, 0, 0];
        chickenSound.play(`spawn${1 + Helper.roll(1)}`);
    }
}

Chicken.prototype.updatePosition = function () {
    this.va[0]++;
    this.va[1]++;

    for (v[5] in shots){
        if (shots[v[5]].x >= this.x && shots[v[5]].x <= this.x + this.w && shots[v[5]].y + 5 >=
            this.y && shots[v[5]].y <= this.y + this.h) {
            delete chicken[v[10]];
            delete shots[v[5]];
        }
    }

    for (v[4] in player){
        if (player[v[4]].x + player[v[4]].w >= this.x && player[v[4]].x <= this.x + this.w && player[v[4]].damageDelay == false
            && this.y + this.h >= player[v[4]].y && player[v[4]].y + player[v[4]].h >= this.y){
            this.va[2]++;
            player[v[4]].health--;
            player[v[4]].damageDelay = true;
        }
    }

    if (this.va[0] > 20 + Helper.roll(35)){
        if (this.direction == 1){
            this.direction = 2;
        } else {
            this.direction = 1;
        }
        this.va[0] = 0;
    }

    if (this.va[1] > 10){
        this.y += this.h - this.h / 1.01;
        this.w = this.w / 1.01;
        this.h = this.h / 1.01;
        this.va[1] = 0;
        this.va[2]++;
    }

    if (level !== 3 || bossdead || this.va[2] > 20){
        delete chicken[v[10]];
    }

    for (v[3] in platform){
        if (this.x + this.w > platform[v[3]].x + 3 && this.x < platform[v[3]].x + platform[v[3]].w - 3 && this.y + this.h >= platform[v[3]].y
            && this.y + this.h < platform[v[3]].y + 5 ){

            if (this.va[2] == 0){
                this.direction = Helper.roll(2);
                this.va[2] = 1;
            }

        }  else if (this.y < 420) {
            this.va[2] = 0;
            this.y += 2;
            this.direction = -10;
        }
    }
    this.x += this.direction ? 2 : -2;
};

Chicken.prototype.paint = function (ctx) {
    let img = chickenImage;
    if (this.direction != 1){
        img = chickenImage_flip
    }
    drawI(img, this.x, this.y, this.w, this.h);
}

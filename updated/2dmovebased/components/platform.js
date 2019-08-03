class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

Platform.prototype.paint = function () {

    if (level != 2){
        this.x = 100;
        this.y = 380;
        this.w = 9 * size;
        this.h = 10;
    } else {
        this.x = -200;
        this.y = 420;
        this.w = 3 * size;
        this.h = 10;
    }

    if (level != 2){
        const img = level === 3 ? stoneCenter : grass;
        let size = 35;
        for (var i = 105; i <= this.w; i += size) {
            drawI(img, this.x + i - 70, this.y - 5, 35, 35);
        }

        if (level == 3){
            drawI(stoneCliffLeft, this.x, this.y -  5, 35, 35);
            drawI(stoneCliffRight, this.x + this.w - 35, this.y - 5, 35, 35);
        } else {
            drawI(grassCliffLeft, this.x, this.y -  5, 35, 35);
            drawI(grassCliffRight, this.x + this.w - 35, this.y - 5, 35, 35);
        }
    }
};

class Shot {
    constructor (options = {}) {
        Object.assign(this, options);
        this.damage = 1;
        this.d = 3;
        this.r = this.d/2;
        this.lifetime = 0;
        this.id = Helper.roll(9999);

        shots.push(this);
        drawI(eval(`ignition${this.dx > 0 ? 'Right' : 'Left'}_${Helper.roll(1) + 1}`),
              this.x + Helper.roll(5),
              this.y -10 + Helper.roll(5), 20 - Helper.roll(5), 20 - Helper.roll(5));

    }
}

Shot.prototype.updatePosition = function () {
    this.x += this.dx;
    this.y += this.dy;
    this.dx /= 1.05;
    this.dy *= 1.15;
    this.lifetime++;

    if (this.y > c.height - size * 2 || this.lifetime > 300) {
        try {
            shots.splice(shots.findIndex(x => x.id === this.id), 1);
        } catch (e) {
            console.error(e);
            shots = [];
        }
        delete this;
    }
};

Shot.prototype.paint = function (ctx) {
    ctx.fillStyle="#6E6E6E";
    ctx.beginPath();
    ctx.arc(this.x -this.r, this.y -this.r, this.d, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
};

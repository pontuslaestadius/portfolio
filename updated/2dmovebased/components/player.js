class Player {
    constructor() {
        this.d = 0;
        this.x = 30;
        this.y = c.height - 35 * 2;
        this.w = 23;
        this.h = 42;
        this.alreadyJumping = false;
        this.facingRight = true;
        this.health = 3;
        this.ani = 0;
        this.xRight = 0;
        this.xLeft = 0;
        this.damageDelay = false;
        this.nextmag = false;
        this.gotWeapon2 = false;
        this.gotWeapon3 = false;
        this.reload = false;
        this.jumpNow = false;
        this.walkLeft = false;
        this.walkRight = false;
        this.falling = true;
        this.weapon = 3;
        this.s = 15;
        this.n = 0;
        this.jumpSpeed = 0;
        this.jumpSpeed2 = 0;
        this.fired = false;
        this.b = 0;
        this.t = 0;
        this.z = 0;
        this.e = 0;
        this.weapon1 = [13, 2, 150];
        this.weapon2 = [6, 6, 200];
        this.weapon3 = [30, 4, 60];
        this.fallingSpeed = 0;
        this.k = 0;
        this.alreadyOnGround = false;
        this.kb = [0, 0];
        this.oldD = "R";
    }
}
Player.prototype.paint = function (ctx) {
    this.ani = this.ani >= 3.8 ? 1 : this.ani + 0.2;
    if (this.alreadyJumping) {
        this.ani = 2;
    } else if (this.xRight + this.xLeft === 0) {
        this.ani = 1;
    } else {
        this.oldD = (this.xRight + this.xLeft > 0) ? "R" : "L";
    }
    this.paintWeapon(ctx);
    if (!this.damageDelay || this.damageDelay && this.ani % 2 == 0) {
        drawI(eval(`walk_${Math.floor(this.ani)}${this.oldD}`), this.x, this.y, this.w, this.h);
    }
};
Player.prototype.updatePosition = function () {
    if (!this.alreadyJumping) {
        if (this.kb[1] == 1){
            this.kb[1] += 1;
            this.x += this.facingRight ? -3 : 3;
        } else if (this.kb[1] == 2) {
            this.kb[1] += 1;
            this.x += this.facingRight ? -2 : 2;
        } else if (this.kb[1] == 3) {
            this.kb[1] += 1;
            if (this.facingRight){
                this.x -= 1;
            } else {
                this.x += 1;
            }
        } else if (this.kb[1] == 4) {
            this.kb[1] = 0;
        }
        if (this.kb[0] == 1){
            this.kb[0] += 1;
            this.x += this.facingRight ? -5 : 5;
        } else if (this.kb[0] == 2) {
            this.kb[0] += 1;
            this.x += this.facingRight ? -3 : 3;
        } else if (this.kb[0] == 3) {
            this.kb[0] += 1;
            this.x += this.facingRight ? -1 : -1;
        } else if (this.kb[0] == 4) {
            this.kb[0] = 0;
        }
    }
    this.reload = (this.ammo < 1 && this.mag > 0 && !this.reload);
    if (this.nextmag){
        if (this.weapon == 1){
            this.weapon1[0] = 13;
            this.weapon1[1]--;
        }
        if (this.weapon == 2){
            this.weapon2[0] = 6;
            this.weapon2[1]--;
        }
        if (this.weapon == 3){
            this.weapon3[0] = 30;
            this.weapon3[1]--;
        }
        this.reload = false;
        this.nextmag = false;
    }
    if (this.weapon == 1){
        this.ammo = this.weapon1[0];
        this.mag = this.weapon1[1];
    }
    if (this.weapon == 2){
        this.ammo = this.weapon2[0];
        this.mag = this.weapon2[1];
    }
    if (this.weapon == 3){
        this.ammo = this.weapon3[0];
        this.mag = this.weapon3[1];
    }
    this.facingRight = this.xLeft + this.xRight > 0;
    if (this.x > c.width - this.w / 2 && this.walkRight){
        level++;
        player.forEach(x => x.x = 0);
        Level.next();
    }
    if (this.x < 0 - this.w / 2 && this.walkLeft && level > 1){
        player.forEach(x => {
            if (level == 3 && bossdead || level == 2){
                level--;
                Level.previous();
                x.x = c.width - 35;
            }
        });
    }
    if (this.x < 10 && level == 1){
        this.xLeft = 0;
    } else {
        this.walkLeft = true;
    }
    if (this.x < 10 && level == 3 && bossdead == false){
        this.xLeft = 0;
    } else {
        this.walkLeft = true;
    }
    if (this.x > c.width - size && level == 3){
        this.xRight = 0;
    } else {
        this.walkRight = true;
    }
    if (this.health <= 0){
        this.x = 30;
        this.health = 3;
        this.damageDelay = true;
        gold -= 10;
    }
    this.d -= this.d/10;
    if (!this.alreadyJumping) {
        if (this.xLeft) {
            this.d -= 0.3;
        }
        if (this.xRight) {
            this.d += 0.3;
        }
        this.x += (this.xLeft + this.xRight) * 1.5 + this.d;
    } else {
        this.x += this.xLeft + this.xRight + this.d;
    }
    this.jump();
    this.collisionplatform();
    this.collisionEnemy();
    this.delays();
};
Player.prototype.paintWeapon = function (ctx) {
    drawI(eval(`vapen${this.weapon}_player`), this.x,  this.y + 20, 15, 10);
    ctx.restore();
};
Player.prototype.collisionEnemy = function () {
    return;
    if (this.x + this.w >= boss[0].x && this.x <= boss[0].x + boss[0].w && this.y >= boss[0].y && this.y <= boss[0].y + boss[0].h && this.damageDelay == false){
        this.health--;
        this.damageDelay = true;
    }
    if (this.x + this.w - 2 >= enemy[0].x && this.damageDelay == false && this.x <= enemy[0].x + enemy[0].w + 2
        && enemy[0].y + 5 <= this.y + this.h && this.y <= this.y + this.h && enemy[0].levelEnemy == level
        && this.y <= enemy[0].y + enemy[0].h) {
        this.damageDelay = true;
        this.health--;
    }
};
Player.prototype.jump = function () {
    this.jumpSpeed = 0.7 + (Math.pow(this.s / 5.2, 2));
    if (this.y > c.height - size * 2){
        this.jumpSpeed2 = (0.7 + (Math.pow(this.n / 5.2, 2))) / 2;
    } else {
        this.jumpSpeed2 = 0.7 + (Math.pow(this.n / 5.2, 2));
    }
    if (this.jumpNow){
        this.falling = true;
        let mheight = c.height - size * 3;
        if (this.s >= 0){
            this.s--;
            this.y -= this.jumpSpeed;
        }
        if (this.y >= mheight){
            this.y = mheight;
            this.n = 0;
            this.s = 15;
            this.jumpNow = false;
            this.alreadyJumping = false;
        }
        if (!this.falling){
            this.n = 0;
            this.s = 15;
            this.jumpNow = false;
            this.alreadyJumping = false;
        } else if (this.s < 0) {
            this.n++;
            this.y += this.jumpSpeed2;
        }
    }
};
Player.prototype.collisionplatform = function () {
    this.fallingSpeed = 0.7 + (Math.pow(this.k / 5, 2));
    let mheight = c.height - size * 3;
    return;
    for (v[3] in platform){
        if (this.x + this.w >= platform[v[3]].x && this.x < platform[v[3]].x - 5 && this.y + this.h > platform[v[3]].y
            + 10 && this.y < platform[v[3]].y + platform[v[3]].h){
            this.xRight = 0;
        } else {
            this.walkRight = true;
        }
        if (this.x >= platform[v[3]].x + platform[v[3]].w - 5 && this.x <= platform[v[3]].x + platform[v[3]].w && this.y + this.h >
            platform[v[3]].y + 10 && this.y < platform[v[3]].y + platform[v[3]].h){
            this.xLeft = 0;
        } else {
            this.walkLeft = true;
        }
        if (this.x + this.w > platform[v[3]].x + 3 && this.x < platform[v[3]].x + platform[v[3]].w - 3 && this.y + this.h >= platform[v[3]].y
            && this.y + this.h < platform[v[3]].y + 5 ){
            this.jumpNow = false;
            this.alreadyJumping = false;
            this.n = 0;
            this.s = 15;
            if (!this.alreadyOnGround) {
                this.jumpNow = false;
                this.alreadyJumping = false;
                this.alreadyOnGround = true;
            }
        } else if (!this.jumpNow) {
            if (this.y < mheight && !this.jumpNow){
                this.y += this.fallingSpeed;
                this.k++;
                this.alreadyJumping = true;
            }
            if (this.y >= mheight){
                this.y = mheight;
                this.k = 0;
                this.jumpNow = false;
                this.alreadyJumping = false;
            }
            this.falling = true;
        }
    }
};
Player.prototype.buy = function () {
    if (level == 1 && this.x > shop[0].x && this.x +
        this.w < shop[0].x + 35 && this.gotWeapon3 == false && gold >= 500){
        gold -= 500;
        this.gotWeapon3 = true;
        this.weapon = 3;
    }
    if (level == 1 && this.x > shop[0].x + 150 && this.x +
        this.w < shop[0].x + 35 + 150 && this.gotWeapon2 == false && gold >= 200){
        gold -= 200;
        this.gotWeapon2 = true;
        this.weapon = 2;
    }
};
Player.prototype.interact = function () {}
Player.prototype.switchWeaponUp = function () {
    if (this.weapon == 2 && this.gotWeapon3){
        this.weapon++;
    }
    if (this.weapon == 1) {
        if (this.gotWeapon2) {
            this.weapon = 2;
        } else if (this.gotWeapon3) {
            this.weapon = 3;
        }
    }
};
Player.prototype.switchWeaponDown = function () {
    if (this.weapon > 1){
        if (this.weapon == 3 && !this.gotWeapon2){
            this.weapon = 1;
        } else {
            this.weapon--;
        }
    }
};
Player.prototype.delays = function () {
    if (this.reload){
        this.t++;
    }
    if (this.t > 50){
        this.t = 0;
        this.reload = false;
        this.nextmag = true;
    }
    if (this.fired) {
        this.b++;
        if (this.b > 5) {
            this.fired = false;
            this.b = 0;
        }
    }
    if (this.damageDelay){
        this.z++;
        this.e++;
        this.setNumber1 = 10 - this.z / 3;
        if (this.z > 30){
            this.damageDelay = false;
            this.z = 0;
        }
        if (this.e > this.setNumber1){
            this.e = 0;
        }
    }
};
Player.prototype.fire = function () {
    if (this.fired) {
        return;
    }
    if (!this.ammo || ! this.mag) {
        return;
    }
    this.fired = true;
    this.weapon1[0]--;
    gunSound.play(`vapen${this.weapon}_fire`);
    new Shot({
        x: this.x + 10,
        y: this.y + 22,
        dx: 30 * (this.oldD=="L"?-1:1),
        dy: 0.1
    });
};

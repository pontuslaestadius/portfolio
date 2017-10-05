/** Made my Pontus Laestadius Te2K for a school assignment. Jan 2013-Feb 2013. **/

// Nytt sätt att räkna på. Användbart vid störra program.
var v = [0, 0, 350, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Väder, Fiender, Spawntid, Objekt, Spelare, Skott, Boss, Bossdrop, Drop, Bossprojectile, Chicken

var c, ctx;
var go = true;
var lampaAni = 0;
var bossBattleBorderRandomizer;
var bossBattleBorderRandomizerCounter = 0;
var weaponranks = [1, 1, 1];
var bossdead = false;
var onfirstpause = true;
var dif = 0;
var level = 1;
var help = true;
var gold = 1500;
var multiplayer = false;
var enemyOneHp = 7;
var shots = [];
var enemy = [];
var spelare = [];
var weather = [];
var object2 = [];
var boss = [];
var bossdrop = [];
var drop = [];
var shop = [];
var bossprojectile = [];
var chicken = [];

var theme = new Howl({
    urls: [/*'sound/themeSound.ogg',*/ 'sound/themeSound2.mp3', 'sound/themeSound.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.03
});

var gunSound = new Howl({
    urls: ['sound/gunfire.ogg'],
    sprite: {
        vapen3_fire: [300, 120],
        vapen2_fire: [5100, 100],
        vapen1_fire: [12100, 200]
    },
    volume: 0.1
});

var dragonSound = new Howl({
    urls: ['sound/dragon.mp3'],
    sprite: {
        fire: [650, 850]
    },
    volume: 0.05
});

var chickenSound = new Howl({
    urls: ['sound/chicken.wav'],
    sprite: {
        spawn1: [432, 400],
        spawn2: [1663, 600]
    },
    volume: 0.05
});

//howl.play('Sprite');

function initalize(){
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    window.setInterval(gameloop, 30);

    // Separat intervall för skott ger bättre prestanda.
    window.setInterval(bullets, 1);

    // Separat uppdatering för väder.
    window.setInterval(displayWeather, 50);

    // Laddar in klasser som ska användas från starten.
    spelare[0] = new Spelare();
    object2[0] = new Object2();
    boss[0] = new Boss();
}

function gameloop(){

    if(go == true){
        updatePositions();
        repaint();
    }

    // Vid pause.
    else {
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0, 500,500);

        ctx.fillStyle="#FFFFFF";
        ctx.font = "50px Helvetica";
        ctx.fillText("Press P to resume", 40, 40);
        ctx.font = "30px Helvetica";
        ctx.fillText("Upgrade Your weapons!", 90, 140);

        ctx.font = "16px Helvetica";
        ctx.fillText("Cash:" + gold, 10, 135);

        ctx.fillText("100G", 10, 205);
        ctx.drawImage(vapen1, 60, 160);
        ctx.drawImage(buttonUp, 10, 160, 30, 30);
        ctx.drawImage(buttonDown, 10, 210, 30, 30);

        ctx.fillText("150G", 10, 205 + 100);
        ctx.drawImage(vapen2, 60, 160 + 100);
        ctx.drawImage(buttonUp, 10, 160 + 100, 30, 30);
        ctx.drawImage(buttonDown, 10, 210 + 100, 30, 30);

        ctx.fillText("200G", 10, 205 + 200);
        ctx.drawImage(vapen3, 60, 160 + 200);
        ctx.drawImage(buttonUp, 10, 160 + 200, 30, 30);
        ctx.drawImage(buttonDown, 10, 210 + 200, 30, 30);

        if (onfirstpause == true){
            onfirstpause = false;
            alert("Tryck på den motsvarande upp eller ner knapp för att uppgradera eller negradera dina vapen.");
        }

    }
}

function updatePositions(){

    for (v[9] in bossprojectile){
        bossprojectile[v[9]].updatePosition();
    }

    for (v[7] in bossdrop){
        bossdrop[v[7]].updatePosition();
    }

    for (v[6] in boss){
        boss[v[6]].updatePosition();
    }

    // Spelare uppdatering.
    for (v[4] in spelare){
        spelare[v[4]].updatePosition();
        spelare[v[4]].delays();
    }

    // Drop uppdatering.
    for (v[8] in drop) {
        drop[v[8]].updatePosition();
    }
}

function displayWeather(){

    // Väder uppdatering.
    for (v[0] in weather){
        weather[v[0]].updatePosition();
    }
}

function bullets (){

    // Skott uppdatering.
    for (v[5] in shots) {
        shots[v[5]].updatePosition();
    }
}

function repaint(){

    // Rensar canvas.
    ctx.clearRect(0, 0, c.width, c.height);

    // Målar in bakgrund.
    background();

    // Hjälp meddelanden.
    helpMessages();

    // Målar ut klassen objekt.
    for (v[3] in object2){
        object2[v[3]].paint();
    }

    // Affärer som visas i första nivån.
    if (level == 1){
        shop[0] = new Shop();
        shop[0].paint(ctx);
    }

    // Skapar mera väder.
    weather.push(new Weather());
    weather.push(new Weather());

    // Målar ut väder.
    for (v[0] in weather){

        if (weather[v[0]].collision == true && level != 3){
            if (weather[v[0]].y < 424 && weather[v[0]].collision == true && weather[v[0]].levelWeather != level){

            } else {
                weather[v[0]].paint(ctx);
            }
        }
    }
    // --->

    // Målar och uppdaterar drop.
    for (v[8] in drop) {
         if (drop[v[8]].levelBox == level){
             drop[v[8]].updatePosition();
             drop[v[8]].paint(ctx);
         }
    }
    // --->

    // Målar och uppdaterar fiender.
        for (v[1] in enemy){
            if (enemy[v[1]].levelEnemy == level){
                enemy[v[1]].paint(ctx);
                enemy[v[1]].updatePosition();

            } else {
                delete enemy[v[1]];
            }
        }

    for (v[10] in chicken){
         chicken[v[10]].paint(ctx);
         chicken[v[10]].updatePosition();
    }

    // Nivå 2.
    if (level == 2){

        // Räknar som undviker att fiender aldrig skapas.
        v[2]++;

        // Slumpar och skapar fiender.
        if (slumpa(400 - v[2]) == 1){
            enemy.push(new Enemy());
            v[2] = 0;
        }

        // Går drop blinkande.
        for (v[8] in drop){

            if (drop[v[8]].levelBox == level){
                if (drop[v[8]].blink >= 2){
                    drop[v[8]].paint(ctx);
                }
            }


        }
    }
    // --->

    // Målar ut skott.
    for (v[5] in shots) {
        shots[v[5]].paint(ctx);
    }
    // --->

    // Målar ut spelare.
    for (v[4] in spelare){
        spelare[v[4]].paint(ctx);
    }
    // --->

    // Målar ut väder igen.
    for (v[0] in weather){
        if (weather[v[0]].collision == false && level != 3){
            weather[v[0]].paint(ctx);
        }
    }
    // --->

    for (v[7] in bossdrop){
        bossdrop[v[7]].paint();
    }

    // Boss test.

    for (v[6] in boss){
        if (boss[v[6]].health > 0){
            if (level == 3 ){
                boss[v[6]].paint();
            }
        }
    }

    for (v[9] in bossprojectile){
        bossprojectile[v[9]].paint(ctx);
    }

    // Målar ut overlay.
    hud();
}

function helpMessages(){

    // Skriver ut meddelanden.
    if (help == true){
        ctx.fillStyle="#000000";
        ctx.font = "16px Helvetica";

        // Separat för första nivån.
        if (level == 1){
            ctx.fillText("P = Pause.", 10, 70);
            ctx.fillText("Upp pil = Hoppa.", 10, 95);
            ctx.fillText(". och - = byta vapen.", 10, 120);
            ctx.fillText("B = Köpa vapen.", 10, 145);
            ctx.fillText("H = Stäng av hjälp", 10, 170);
        }

        // Separat för andra nivån.
        if (level == 2){
            ctx.fillText("Här möter du på dina första fiender.", 10, 70);
            ctx.fillText("försök att skjuta dom utan att bli skadad.", 10, 95);
            ctx.fillText("Du får 5 poäng för vanliga fiender.", 10, 120);
            ctx.fillText("Nästa nivån möter du på en boss. Var redo!", 10, 145);
        }
    }
}

function background(){

    // Bestämmer bakgrundsfärgen på första nivån.
    if (level == 1){
        ctx.fillStyle="#A9E2F3";
        ctx.fillRect(0, 0, c.height, c.width);
    }

    // Bestämmer bakgrundsfärgen på andra nivån.
    if (level == 2){
        ctx.fillStyle="#A9E2F3";
        ctx.fillRect(0, 0, c.height, c.width);
    }

    // Målar ut backgrunden på tredje nivån.
    if (level == 3){
        ctx.drawImage(bg_castle,0 ,0, 500, 500);
        ctx.drawImage(window1, 80, 350 - 100, 35, 35);
        ctx.drawImage(window1, 80 + 160, 350 - 100, 35, 35);
        ctx.drawImage(window1, 80 + 160 * 2, 350 - 100, 35, 35);

        if (lampaAni >= 1){
            ctx.drawImage(tLit_2, 0, 350 - 100, 35, 35);
            ctx.drawImage(tLit_1, 160, 350 - 100, 35, 35);
            ctx.drawImage(tLit_2, 160 * 2, 350 - 100, 35, 35);
            ctx.drawImage(tLit_1, 160 * 3, 350 - 100, 35, 35);

        } else {
            ctx.drawImage(tLit_1, 0, 350 - 100, 35, 35);
            ctx.drawImage(tLit_2, 160, 350 - 100, 35, 35);
            ctx.drawImage(tLit_1, 160 * 2, 350 - 100, 35, 35);
            ctx.drawImage(tLit_2, 160 * 3, 350 - 100, 35, 35);
        }

        if (lampaAni >= 2){
            lampaAni = 0;
        } else {
            lampaAni += 0.2;
        }
    }

    ground();
}

function hud(){

    // Svarta overlayen.
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0, 500, 50);
    // --->

    // Vid single player overlay.
    if (multiplayer == false){

        ctx.fillRect(6, 6, 24 * 10 + 8, 18);

        // Spelarens liv.
        ctx.fillStyle="#FF0000";
        ctx.fillRect(10, 10, 24 * spelare[0].health, 10);
        // --->

        // Svarta bitar som signalerar mellanrum mellan varje liv.
        ctx.fillStyle="#000000";
        ctx.fillRect(24     - 15, 10, 4, 10);
        ctx.fillRect(24 * 2 - 15, 10, 4, 10);
        ctx.fillRect(24 * 3 - 15, 10, 4, 10);
        ctx.fillRect(24 * 4 - 15, 10, 4, 10);
        ctx.fillRect(24 * 5 - 15, 10, 4, 10);
        ctx.fillRect(24 * 6 - 15, 10, 4, 10);
        ctx.fillRect(24 * 7 - 15, 10, 4, 10);
        ctx.fillRect(24 * 8 - 15, 10, 4, 10);
        ctx.fillRect(24 * 9 - 15, 10, 4, 10);
        ctx.fillRect(24 *10 - 15, 10, 4, 10);
        // --->

        // Visar vilket vapen som används.
        if (spelare[0].weapon == 1){
            ctx.drawImage(vapen1, 260, 0, 80, 50);
        }

        if (spelare[0].weapon == 2 && spelare[0].gotWeapon2 == true){
            ctx.drawImage(vapen2, 260, 0, 200, 50);
        }

        if (spelare[0].weapon == 3 && spelare[0].gotWeapon3 == true){
            ctx.drawImage(vapen3, 260, 0, 200, 50);
        }
        // --->

        // Visar viktig information.
        ctx.fillStyle="#FFFFFF";
        ctx.font = "16px Helvetica";

        ctx.fillText("ammo: " + spelare[0].ammo, 12, 40);
        ctx.fillText("mag: " + spelare[0].mag, 100, 40);
        ctx.fillText("gold: " + gold, 180, 40);
        // --->

        ctx.fillStyle="#000000";
    }
    // --->

    // Vid 2 spelare.
    else {

        // Målar ut rätt vapen i overlayen.
        if (spelare[0].weapon == 1){
            ctx.drawImage(vapen1, 85 + 24 * 11 + 5, 0, 40, 25);
        }

        if (spelare[0].weapon == 2 && spelare[0].gotWeapon2 == true){
            ctx.drawImage(vapen2, 85 + 24 * 11 + 5, 0, 100, 25);
        }

        if (spelare[0].weapon == 3 && spelare[0].gotWeapon3 == true){
            ctx.drawImage(vapen3, 85 + 24 * 11 + 5, 0, 100, 25);
        }

        if (spelare[1].weapon == 1){
            ctx.drawImage(vapen1, 85 + 24 * 11 + 5, 17 + 5, 40, 25);
        }

        if (spelare[1].weapon == 2 && spelare[1].gotWeapon2 == true){
            ctx.drawImage(vapen2, 85 + 24 * 11 + 5, 17 + 5, 100, 25);
        }

        if (spelare[1].weapon == 3 && spelare[1].gotWeapon3 == true){
            ctx.drawImage(vapen3, 85 + 24 * 11 + 5, 17 + 5, 100, 25);
        }
        // --->

        // Visar viktig information.
        ctx.fillStyle="#FFFFFF";
        ctx.font = "16px Helvetica";

        ctx.fillText("Spelare1:", 10, 17);
        ctx.fillText("Spelare2:", 10, 17 + 17 + 5);

        ctx.fillStyle="#F7FE2E";

        ctx.fillText("Cash: " + gold, 260, 17 + (17 + 5) / 2);

        ctx.fillStyle="#FFFFFF";

        ctx.fillText(spelare[0].ammo + "/" + spelare[0].mag, 85 + 24 * 11 + 100, 17);
        ctx.fillText(spelare[1].ammo + "/" + spelare[1].mag, 85 + 24 * 11 + 100, 17 + 17 + 5);

        ctx.fillStyle="#FF0000";

        ctx.fillRect(85, 7, 24 * spelare[0].health, 10);
        ctx.fillRect(85, 7 + 17 + 5, 24 * spelare[1].health, 10);
        // --->

    }
    // --->

    bossBattleBorderRandomizerCounter++;
    if (bossBattleBorderRandomizerCounter > 10){
        bossBattleBorderRandomizer = 5 + slumpa(3);
        bossBattleBorderRandomizerCounter = 0;
    }

    // Vid boss battle.
    if (level == 3){
        ctx.fillStyle="#FF0000";
        ctx.fillRect(0, 0, bossBattleBorderRandomizer, c.height);
        ctx.fillRect(0, 0, c.width, bossBattleBorderRandomizer);
        ctx.fillRect(0, c.height - bossBattleBorderRandomizer, c.width, bossBattleBorderRandomizer);
        ctx.fillRect(c.width - bossBattleBorderRandomizer, 0, bossBattleBorderRandomizer, c.height);

        ctx.beginPath();
        ctx.arc(0, 0, bossBattleBorderRandomizer + 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(c.width, 0, bossBattleBorderRandomizer + 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, c.height, bossBattleBorderRandomizer + 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(c.width, c.height, bossBattleBorderRandomizer + 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

    }

}

function keyDown(e){

    // X - Reset Diffuculty up.
    if (e.keyCode == 88 && bossdead == true){
        level = 1;
        bossdead = false;
        dif++;

        boss.push(new Boss());

        if (dif >= 1){
            boss.push(new Boss());
        }

        if (dif >= 2){
            boss.push(new Boss());
        }

        if (dif >= 3){
            boss.push(new Boss());
        }

        if (dif >= 4){
            boss.push(new Boss());
        }


        for (v[4] in spelare){
            spelare[v[4]].x = 30;
            spelare[v[4]].y = 395;
        }
    }

    // L - fusk level up.
    if (e.keyCode == 76){
        level++;
    }

    // M - Multiplayer.
    if (e.keyCode == 77){

        if (multiplayer == false){
            weaponranks = 1;
            spelare.push(new Spelare());
        }
        multiplayer = true;
    }

    // W - Spelare2 hopp.
    if(e.keyCode == 87){
            if (multiplayer == true){
                if (spelare[1].alreadyJumping == false){
                    spelare[1].alreadyJumping = true;
                    spelare[1].jumpNow = true;
                }
            } else if (multiplayer == false) {
                alert("Klicka på M för att lägga till spelare");
            }
        }

    // F - Spelare2 skjut.
    if(e.keyCode == 70){
            if (multiplayer == true){
                spelare[1].fire();
            } else if (multiplayer == false) {
                alert("Klicka på M för att lägga till spelare");
            }

        }

    // D - Spelare2 gå höger.
    if (e.keyCode == 68){
            if (multiplayer == true){
                spelare[1].xRight = 2;

            } else if (multiplayer == false) {
                alert("Klicka på M för att lägga till spelare");
            }
        }

    // A - Spelare2 gå vänster.
    if (e.keyCode == 65){

            if (multiplayer == true){
                spelare[1].xLeft = -2;

            } else if (multiplayer == false) {
                alert("Klicka på M för att lägga till spelare");
            }
        }

    // B - defualt för både spelare att köpa vapen. TODO: Gör en separat för varje spelare.
    if (e.keyCode == 66){
        for (v[4] in spelare){
            spelare[v[4]].buy();
        }

    }

    // Y - Spelare2 Byta vapen upp.
    if (e.keyCode == 84){
        if (multiplayer == true){
            spelare[1].switchWeaponUp();
        } else if (multiplayer == false){
            alert("Klicka på M för att lägga till spelare");
        }
    }

    // T - Spelare2 Byta vapen ner.
    if (e.keyCode == 89){
        if (multiplayer == true){
            spelare[1].switchWeaponDown();
        } else if (multiplayer == false){
            alert("Klicka på M för att lägga till spelare");
        }
    }

    // . - Spelare1 Byta vapen upp.
    if (e.keyCode == 189){
        spelare[0].switchWeaponUp();
    }

    // - - Spelare1 Byta vapen ner.
    if (e.keyCode == 190){
        spelare[0].switchWeaponDown();
    }

    // H - Hjälp meddelanden.
    if (e.keyCode == 72){
        help = help == false;
    }

    // P - Pausa.
    if (e.keyCode == 80){
        go = go == false;


        if (go == true){
            theme.play();
        } else {
            theme.pause();
        }
    }

    // Space - Spelare1 Skjut.
    if(e.keyCode == 32){
        spelare[0].fire();
    }

    // Höger pil tangent - Spelare1 Gå höger.
    if(e.keyCode == 39){
        spelare[0].xRight = 2;
    }

    // Vänster pil tangent - Spelare1 Gå vänster.
    if(e.keyCode == 37){
        spelare[0].xLeft = -2;
    }

    // Upp pil tangent - Spelare1 Hoppa.
    if(e.keyCode == 38){
        if (spelare[0].alreadyJumping == false){
            spelare[0].alreadyJumping = true;
            spelare[0].jumpNow = true;
        }
    }
}

function keyUp(e){

    // D
    if (e.keyCode == 68){
        spelare[1].xRight = 0;
    }

    // A
    if (e.keyCode == 65){
        spelare[1].xLeft = 0;
    }


    // Höger pil.
    if(e.keyCode == 39){
        spelare[0].xRight = 0;
    }

    // Vänster pil.
    if(e.keyCode == 37){
        spelare[0].xLeft = 0;
    }
}

function onClick(e){

    e.clientX;
    e.clientY;

    if (go == false && e.clientX >= 10 && multiplayer == false){

        if (e.clientY >= 160 && e.clientY <= 190 && weaponranks[0] < 5 && gold >= 100){
            weaponranks[0] += 1;
            gold -= 100;
            alert("Vapen 1 upgraderat. Nuvarande rank: " + weaponranks[0]);
        }

        if (e.clientY >= 160 + 50 && e.clientY <= 190 + 50 && weaponranks[0] > 1 && gold >= 100){
            weaponranks[0] -= 1;
            gold -= 100;
            alert("Vapen 1 nergraderat. Nuvarande rank: " + weaponranks[0]);
        }

        if (e.clientY >= 260 && e.clientY <= 290 && weaponranks[1] < 5 && gold >= 150){
            weaponranks[1] += 1;
            gold -= 150;
            alert("Vapen 2 upgraderat. Nuvarande rank: " + weaponranks[1]);
        }

        if (e.clientY >= 260 + 50 && e.clientY <= 290 + 50 && weaponranks[1] > 1 && gold >= 150){
            weaponranks[1] -= 1;
            gold -= 150;
            alert("Vapen 2 nergraderat. Nuvarande rank: " + weaponranks[1]);
        }

        if (e.clientY >= 360 && e.clientY <= 390 && weaponranks[2] < 5 && gold >= 200){
            weaponranks[2] += 1;
            gold -= 200
            alert("Vapen 3 upgraderat. Nuvarande rank: " + weaponranks[2]);
        }

        if (e.clientY >= 360 + 50 && e.clientY <= 390 + 50 && weaponranks[2] > 1 && gold >= 200){
            weaponranks[2] -= 1;
            gold -= 200;
            alert("Vapen 3 nergraderat. Nuvarande rank: " + weaponranks[2]);
        }

    }

    /**

    ctx.drawImage(buttonUp, 10, 160, 30, 30);
    ctx.drawImage(buttonDown, 10, 210, 30, 30);

    ctx.drawImage(buttonUp, 10, 160 + 100, 30, 30);
    ctx.drawImage(buttonDown, 10, 210 + 100, 30, 30);

    ctx.drawImage(buttonUp, 10, 160 + 200, 30, 30);
    ctx.drawImage(buttonDown, 10, 210 + 200, 30, 30);

    */
}

function slumpa(max){
    return Math.round(Math.random()*max)
}

function ground() {

    // Hade ett annat sätt att måla ut marken innan. Men det fick spelet att lagga.
    if (level < 3){
        ctx.drawImage(grass, 0, 430, 35, 35);
        ctx.drawImage(grass, 35, 430, 35, 35);
        ctx.drawImage(grass, 70, 430, 35, 35);
        ctx.drawImage(grass, 105, 430, 35, 35);
        ctx.drawImage(grass, 140, 430, 35, 35);
        ctx.drawImage(grass, 175, 430, 35, 35);
        ctx.drawImage(grass, 210, 430, 35, 35);
        ctx.drawImage(grass, 245, 430, 35, 35);
        ctx.drawImage(grass, 280, 430, 35, 35);
        ctx.drawImage(grass, 315, 430, 35, 35);
        ctx.drawImage(grass, 350, 430, 35, 35);
        ctx.drawImage(grass, 385, 430, 35, 35);
        ctx.drawImage(grass, 420, 430, 35, 35);
        ctx.drawImage(grass, 455, 430, 35, 35);
        ctx.drawImage(grass, 490, 430, 35, 35);

        ctx.drawImage(grassCenter, 0, 465, 35, 35);
        ctx.drawImage(grassCenter, 35, 465, 35, 35);
        ctx.drawImage(grassCenter, 70, 465, 35, 35);
        ctx.drawImage(grassCenter, 105, 465, 35, 35);
        ctx.drawImage(grassCenter, 140, 465, 35, 35);
        ctx.drawImage(grassCenter, 175, 465, 35, 35);
        ctx.drawImage(grassCenter, 210, 465, 35, 35);
        ctx.drawImage(grassCenter, 245, 465, 35, 35);
        ctx.drawImage(grassCenter, 280, 465, 35, 35);
        ctx.drawImage(grassCenter, 315, 465, 35, 35);
        ctx.drawImage(grassCenter, 350, 465, 35, 35);
        ctx.drawImage(grassCenter, 385, 465, 35, 35);
        ctx.drawImage(grassCenter, 420, 465, 35, 35);
        ctx.drawImage(grassCenter, 455, 465, 35, 35);
        ctx.drawImage(grassCenter, 490, 465, 35, 35);
    } else {

        ctx.drawImage(castleMid, 0, 430, 35, 35);
        ctx.drawImage(castleMid, 35, 430, 35, 35);
        ctx.drawImage(castleMid, 70, 430, 35, 35);
        ctx.drawImage(castleMid, 105, 430, 35, 35);
        ctx.drawImage(castleMid, 140, 430, 35, 35);
        ctx.drawImage(castleMid, 175, 430, 35, 35);
        ctx.drawImage(castleMid, 210, 430, 35, 35);
        ctx.drawImage(castleMid, 245, 430, 35, 35);
        ctx.drawImage(castleMid, 280, 430, 35, 35);
        ctx.drawImage(castleMid, 315, 430, 35, 35);
        ctx.drawImage(castleMid, 350, 430, 35, 35);
        ctx.drawImage(castleMid, 385, 430, 35, 35);
        ctx.drawImage(castleMid, 420, 430, 35, 35);
        ctx.drawImage(castleMid, 455, 430, 35, 35);
        ctx.drawImage(castleMid, 490, 430, 35, 35);

        ctx.drawImage(castleCenter, 0, 465, 35, 35);
        ctx.drawImage(castleCenter, 35, 465, 35, 35);
        ctx.drawImage(castleCenter, 70, 465, 35, 35);
        ctx.drawImage(castleCenter, 105, 465, 35, 35);
        ctx.drawImage(castleCenter, 140, 465, 35, 35);
        ctx.drawImage(castleCenter, 175, 465, 35, 35);
        ctx.drawImage(castleCenter, 210, 465, 35, 35);
        ctx.drawImage(castleCenter, 245, 465, 35, 35);
        ctx.drawImage(castleCenter, 280, 465, 35, 35);
        ctx.drawImage(castleCenter, 315, 465, 35, 35);
        ctx.drawImage(castleCenter, 350, 465, 35, 35);
        ctx.drawImage(castleCenter, 385, 465, 35, 35);
        ctx.drawImage(castleCenter, 420, 465, 35, 35);
        ctx.drawImage(castleCenter, 455, 465, 35, 35);
        ctx.drawImage(castleCenter, 490, 465, 35, 35);
    }
}

function Spelare(x, y, w, h, alreadyJumping, facingRight, health, ani, xRight, xLeft, damageDelay, nextmag,
                 gotWeapon2, gotWeapon3, reload, jumpNow, walkLeft, walkRight, falling, weapon, s,
                 n, jumpSpeed, jumpSpeed2, fired, b, t, z, e, weapon1, weapon2, weapon3, ammo, mag,
                 setNumber1, fallingSpeed, k, fuckingMultiplayerFixerBullshitVariableBecauseICantCode,
                 alreadyOnGround, kb){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alreadyJumping = alreadyJumping;
    this.facingRight = facingRight;
    this.health = health;
    this.ani = ani;
    this.xRight = xRight;
    this.xLeft = xLeft;
    this.damageDelay = damageDelay;
    this.nextmag = nextmag;
    this.gotWeapon2 = gotWeapon2;
    this.gotWeapon3 = gotWeapon3;
    this.reload = reload;
    this.jumpNow = jumpNow;
    this.walkLeft = walkLeft;
    this.walkRight = walkRight;
    this.falling = falling;
    this.weapon = weapon;
    this.s = s;
    this.n = n;
    this.jumpSpeed = jumpSpeed;
    this.jumpSpeed2 = jumpSpeed2;
    this.fired = fired;
    this.b = b;
    this.t = t;
    this.z = z;
    this.e = e;
    this.weapon1 = weapon1;
    this.weapon2 = weapon2;
    this.weapon3 = weapon3;
    this.ammo = ammo;
    this.mag = mag;
    this.setNumber1 = setNumber1;
    this.fallingSpeed = fallingSpeed;
    this.k = k;
    this.fuckingMultiplayerFixerBullshitVariableBecauseICantCode =
        fuckingMultiplayerFixerBullshitVariableBecauseICantCode;
    this.alreadyOnGround = alreadyOnGround;
    this.kb = kb;

    this.x = 30;
    this.y = 395;
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
    this.weapon = 1;
    this.s = 15;
    this.n = 0;
    this.jumpSpeed = 0;
    this.jumpSpeed2 = 0;
    this.fired = false;
    this.b = 0;
    this.t = 0;
    this.z = 0;
    this.e = 0;
    this.weapon1 = [13, 2, 1500];
    this.weapon2 = [6, 6, 2000];
    this.weapon3 = [30, 4, 200];
    this.fallingSpeed = 0;
    this.k = 0;
    this.fuckingMultiplayerFixerBullshitVariableBecauseICantCode = false;
    this.alreadyOnGround = false;
    this.kb = [0, 0];
}

Spelare.prototype.paint = function (ctx) {

    // Visar att du laddar om.
    if (this.reload == true){
        ctx.font = "10px Helvetica";
        ctx.fillStyle="#000000";
        ctx.fillText("Reloading..", this.x - 15, this.y - 10);
    }

    // Målar ut spelare.
    if (this.damageDelay == false){
        if (this.ani >= 4){this.ani = 0;}

        if (this.facingRight == true){
            if (this.jumpNow == false && this.xRight == 2){

                if (this.xRight + this.xLeft > 0){

                    if (this.ani >= 3 && this.ani < 4){
                        ctx.drawImage(walk_3R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 2 && this.ani < 3){
                        ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 1 && this.ani < 2){
                        ctx.drawImage(walk_2R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 0 && this.ani < 1){
                        ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                } else {
                    ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                }

            } else {

                if (this.jumpNow == false){
                    ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);

                } else {
                    ctx.drawImage(walk_2R, this.x, this.y, this.w, this.h);
                }

            }
        }  else {
            if (this.jumpNow == false && this.xLeft == -2){

                if (this.xRight + this.xLeft < 0){

                    if (this.ani >= 3 && this.ani < 4){
                        ctx.drawImage(walk_3L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 2 && this.ani < 3){
                        ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 1 && this.ani < 2){
                        ctx.drawImage(walk_2L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 0 && this.ani < 1){
                        ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                } else {
                    ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                }


            } else {
                if (this.jumpNow == false){
                    ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);

                } else {
                    ctx.drawImage(walk_2L, this.x, this.y, this.w, this.h);
                }
            }
        }

        this.paintWeapon (ctx);

    }

    // Skapar blinkande spelare vid skada.
    if (this.damageDelay == true && this.e <= 1) {
        if (this.ani >= 4){this.ani = 0;}

        if (this.facingRight == true){
            if (this.jumpNow == false && this.xRight == 2){

                if (this.xRight + this.xLeft > 0){

                    if (this.ani >= 3 && this.ani < 4){
                        ctx.drawImage(walk_3R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 2 && this.ani < 3){
                        ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 1 && this.ani < 2){
                        ctx.drawImage(walk_2R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 0 && this.ani < 1){
                        ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                } else {
                    ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);
                }

            } else {

                if (this.jumpNow == false){
                    ctx.drawImage(walk_1R, this.x, this.y, this.w, this.h);

                } else {
                    ctx.drawImage(walk_2R, this.x, this.y, this.w, this.h);
                }

            }
        }  else {
            if (this.jumpNow == false && this.xLeft == -2){

                if (this.xRight + this.xLeft < 0){

                    if (this.ani >= 3 && this.ani < 4){
                        ctx.drawImage(walk_3L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 2 && this.ani < 3){
                        ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 1 && this.ani < 2){
                        ctx.drawImage(walk_2L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                    if (this.ani >= 0 && this.ani < 1){
                        ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                        this.ani += 0.2;
                    }

                } else {
                    ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);
                }


            } else {
                if (this.jumpNow == false){
                    ctx.drawImage(walk_1L, this.x, this.y, this.w, this.h);

                } else {
                    ctx.drawImage(walk_2L, this.x, this.y, this.w, this.h);
                }
            }
        }

        this.paintWeapon (ctx);

    }
};

Spelare.prototype.updatePosition = function () {

    if (this.kb[1] == 1){
        this.kb[1] += 1;
        if (this.facingRight == true){
            this.x -= 3;
        } else {
            this.x += 3;
        }
    } else if (this.kb[1] == 2) {
        this.kb[1] += 1;
        if (this.facingRight == true){
            this.x -= 2;
        } else {
            this.x += 2;
        }
    } else if (this.kb[1] == 3) {
        this.kb[1] += 1;
        if (this.facingRight == true){
            this.x -= 1;
        } else {
            this.x += 1;
        }
    } else if (this.kb[1] == 4) {
        this.kb[1] = 0;
    }

    if (this.kb[0] == 1){
        this.kb[0] += 1;
        if (this.facingRight == true){
            this.x -= 5;
        } else {
            this.x += 5;
        }
    } else if (this.kb[0] == 2) {
        this.kb[0] += 1;
        if (this.facingRight == true){
            this.x -= 3;
        } else {
            this.x += 3;
        }
    } else if (this.kb[0] == 3) {
        this.kb[0] += 1;
        if (this.facingRight == true){
            this.x -= 1;
        } else {
            this.x += 1;
        }
    } else if (this.kb[0] == 4) {
        this.kb[0] = 0;
    }

    // Kollar om man ska ladda om.
    if (this.ammo < 1 && this.mag > 0 && this.reload == false){
        this.reload = true;
    }

    // Kollar vilket vapen, och laddar om.
    if (this.nextmag == true){

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

    // Bestämmer antal ammunition för varje vapen.
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

    // Deklarerar vilket håll spelaren är riktad åt.
    if (this.xLeft + this.xRight > 0){
        this.facingRight = true;
    }

    if (this.xLeft + this.xRight < 0){
        this.facingRight = false;
    }

    // Gå till nästa nivå.
    if (this.x > 500 - this.w / 2 && this.walkRight == true){
        level++;

        for (v[4] in spelare){
            spelare[v[4]].x = 0;
        }

        delete shots[v[5]];
        delete bossprojectile[v[9]];
    }

    // Gå till förra nivå.
    if (this.x < 0 - this.w / 2 && this.walkLeft == true && level > 1){

        for (v[4] in spelare){

        if (level == 3 && bossdead == true){
            level--;
            spelare[v[4]].x = 480;
        } else if (level == 2) {
            level--;
            spelare[v[4]].x = 480;
        }

        delete shots[v[5]];
        delete bossprojectile[v[9]];
        }
    }

    // Blockerar vänster.
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

    // BLockerar Höger.
    if (this.x > 475 && level == 3){
        this.xRight = 0;
    } else {
        this.walkRight = true;
    }

    // Vid död.
    if (this.health <= 0){
        this.x = 30;
        this.health = 3;
        this.damageDelay = true;
        gold -= 10;
    }

    // Spelare total hastighet.
    this.x += (this.xLeft + this.xRight) * 1.5;

    this.jump();
    this.collisionobject2();
    this.collisionEnemy();

};

Spelare.prototype.paintWeapon = function (ctx) {

    // Måla det specifica vapenet om man kollar höger.
    if (this.facingRight == true){
        if (this.weapon == 1){
            ctx.drawImage(vapen1_spelare, this.x + 10,  this.y + 20, 15, 10);
        }

        if (this.weapon == 2 && this.gotWeapon2 == true){
            ctx.drawImage(vapen2_spelare, this.x + 12,  this.y + 20, 30, 10); // flip this
        }

        if (this.weapon == 3 && this.gotWeapon3 == true){
            ctx.drawImage(vapen3_spelare, this.x + 12,  this.y + 20, 30, 10); // flip this
        }
    }

    // Om man kolalr vänster. Måla vapnet åt sama håll.
    if (this.facingRight == false){
        if (this.weapon == 1){
            ctx.drawImage(vapen1_spelare_flip, this.x - 2,  this.y + 20, 15, 10); // flip this
        }

        if (this.weapon == 2 && this.gotWeapon2 == true){
            ctx.drawImage(vapen2_spelare_flip, this.x - 20,  this.y + 20, 30, 10); // flip this
        }

        if (this.weapon == 3 && this.gotWeapon3 == true){
            ctx.drawImage(vapen3_spelare_flip, this.x - 20,  this.y + 20, 30, 10); // flip this
        }
    }
};

Spelare.prototype.collisionEnemy = function () {

    for (v[6] in boss){
        if (this.x + this.w >= boss[v[6]].x && this.x <= boss[v[6]].x + boss[v[6]].w && this.y >= boss[v[6]].y && this.y <= boss[v[6]].y + boss[v[6]].h && this.damageDelay == false){
            this.health--;
            this.damageDelay = true;
        }
    }

    // Om spelare går in i fiende. Ta skada.
    for (v[1] in enemy){
        if (this.x + this.w - 2 >= enemy[v[1]].x && this.damageDelay == false && this.x <= enemy[v[1]].x + enemy[v[1]].w + 2
            && enemy[v[1]].y + 5 <= this.y + this.h && this.y <= this.y + this.h && enemy[v[1]].levelEnemy == level
            && this.y <= enemy[v[1]].y + enemy[v[1]].h) {
            this.damageDelay = true;
            this.health--;
            if (this.weapon == 3 && this.gotWeapon3 == true){
                enemy[v[1]].health -= shots[v[5]].damage;
            }
        }
    }
};

Spelare.prototype.jump = function () {

    // Ekvation för hoppet upp.
    this.jumpSpeed = 0.7 + (Math.pow(this.s / 5.2, 2));

    // Ekvation för hoppet ner.
    if (this.y > 390){
        this.jumpSpeed2 = (0.7 + (Math.pow(this.n / 5.2, 2))) / 2;
    } else {
        this.jumpSpeed2 = 0.7 + (Math.pow(this.n / 5.2, 2));
    }

    // Om man ska hoppa.
    if (this.jumpNow == true){

        // Gör så att man inte faller under hopp.
        this.falling = true;

        // Under hopp upp.
        if (this.s >= 0){
            this.s--;
            this.y -= this.jumpSpeed;
        }

        // Gör så att hoppet slutar.
        if (this.y >= 394){
            this.y = 395;
            this.n = 0;
            this.s = 15;
            this.jumpNow = false;
            this.alreadyJumping = false;
        }

        // Gör så att hoppet slutar. Om kravet inte uppfylls: Så förflyttas spelare neråt (y+).
        if (this.falling == false){
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

Spelare.prototype.collisionobject2 = function () {

    // Objekt Collision Höger.
    for (v[3] in object2){
        if (this.x + this.w >= object2[v[3]].x && this.x < object2[v[3]].x - 5 && this.y + this.h > object2[v[3]].y
            + 10 && this.y < object2[v[3]].y + object2[v[3]].h){
            this.xRight = 0;
        } else {
            this.walkRight = true;
        }

        // Objekt Collision Vänster.
        if (this.x >= object2[v[3]].x + object2[v[3]].w - 5 && this.x <= object2[v[3]].x + object2[v[3]].w && this.y + this.h >
            object2[v[3]].y + 10 && this.y < object2[v[3]].y + object2[v[3]].h){
            this.xLeft = 0;
        } else {
            this.walkLeft = true;
        }

        // Gravitations ekvation.
        this.fallingSpeed = 0.7 + (Math.pow(this.k / 5, 2));

        // object2 mark. TODO: Fixa så man kan ha mer än ett objekt.
        if (this.x + this.w > object2[v[3]].x + 3 && this.x < object2[v[3]].x + object2[v[3]].w - 3 && this.y + this.h >= object2[v[3]].y
            && this.y + this.h < object2[v[3]].y + 5 ){
            this.jumpNow = false;
            this.alreadyJumping = false;
            this.n = 0;
            this.s = 15;

            if (this.alreadyOnGround == false){
                this.jumpNow = false;
                this.alreadyJumping = false;
                this.alreadyOnGround = true;
            }

        } else if (this.jumpNow == false) {
            if (this.y < 395 && this.jumpNow == false){
                this.y += this.fallingSpeed;
                this.k++;
                this.alreadyJumping = true;
            }
            if (this.y >= 395){
                this.y = 395;
                this.k = 0;
                this.jumpNow = false;
                this.alreadyJumping = false;
            }
            this.falling = true;
        }
    }
};

Spelare.prototype.buy = function () {

    // AK affären.
    if (level == 1 && this.x > shop[0].x && this.x +
        this.w < shop[0].x + 35 && this.gotWeapon3 == false && gold >= 500){
        gold -= 500;
        this.gotWeapon3 = true;
        this.weapon = 3;
    }

    // Shotgun affären.
    if (level == 1 && this.x > shop[0].x + 150 && this.x +
        this.w < shop[0].x + 35 + 150 && this.gotWeapon2 == false && gold >= 200){
        gold -= 200;
        this.gotWeapon2 = true;
        this.weapon = 2;
    }
};

Spelare.prototype.switchWeaponUp = function () {

    // Byter vapen. Om man har nästa vapen.
    if (this.weapon == 2 && this.gotWeapon3 == true){
        this.weapon++;
    }

    // Byter vapen. Om man har nästa vapen. Om man har vapen 3 men inte 2. Hoppar över vapen 2.
    if (this.weapon == 1){

        if (this.gotWeapon2 == true){
            this.weapon = 2;
        }

        if (this.gotWeapon2 == false && this.gotWeapon3 == true){
            this.weapon = 3;
        }
    }
};

Spelare.prototype.switchWeaponDown = function () {

    // Byter vapen ner.
    if (this.weapon > 1){

        if (this.weapon == 3 && this.gotWeapon2 == false){
            this.weapon = 1;
        } else {
            this.weapon--;
        }
    }
};

Spelare.prototype.delays = function () {

    // Omladdnings tid.
    if (this.reload == true){
        this.t++;
    }

    // Reset.
    if (this.t > 50){
        this.t = 0;
        this.reload = false;
        this.nextmag = true;
    }

    // Delay mellan varje skott.
    if (this.weapon == 1){
        if (this.fired == true){
            this.b++;
            if(this.b > this.weapon1[2] / 30){
                this.fired = false;
                this.b = 0;
            }
        }
    } else if (this.weapon == 2){
        if (this.fired == true){
            this.b++;
            if(this.b > this.weapon2[2] / 30){
                this.fired = false;
                this.b = 0;
            }
        }
    } else if (this.weapon == 3){
        if (this.fired == true){
            this.b++;
            if(this.b > this.weapon3[2] / 30){
                this.fired = false;
                this.b = 0;
            }
        }
    }

    // Damagedelay.
    if (this.damageDelay == true){
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

Spelare.prototype.fire = function () {

    // Fired är en delay så att man inte kan skjuta för snabbt. Och dtta är en skjut if.
    if(this.fired == false && this.ammo >= 1 && this.mag >= 0){

        this.fired = true;
        this.fuckingMultiplayerFixerBullshitVariableBecauseICantCode = true;

        if (this.weapon == 1){
            this.weapon1[0]--;
            gunSound.play('vapen1_fire');
        }

        if (this.weapon == 2){
            this.weapon2[0]--;
            this.kb[0] = 1;
            gunSound.play('vapen2_fire');
        }

        if (this.weapon == 3){
            this.weapon3[0]--;
            this.kb[1] = 1;
            gunSound.play('vapen3_fire');
        }

        shots.push(new Shot());
    }
};

function Enemy(x, y, direction, health, totalHealth, goldGiven, w, h, enemyGoRight, ani, type, levelEnemy, a,
               jumpSpeed, jumpSpeed2, jumpNow, s, n, alreadyJumping){
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.health = health;
    this.totalHealth = totalHealth;
    this.goldGiven = goldGiven;
    this.w = w;
    this.h = h;
    this.enemyGoRight = enemyGoRight;
    this.ani = ani;
    this.type = type;
    this.levelEnemy = levelEnemy;
    this.a = a;
    this.jumpSpeed = jumpSpeed;
    this.jumpSpeed2 = jumpSpeed2;
    this.jumpNow = jumpNow;
    this.s = s;
    this.n = n;
    this.alreadyJumping = alreadyJumping;

    this.x = 100 + slumpa(150);
    this.y = 392;
    this.direction = slumpa(2);
    this.goldGiven = false;
    this.enemyGoRight = true;
    this.ani = 0;
    this.type = slumpa(3);

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
}

Enemy.prototype.updatePosition = function () {

    if (this.health <= 0){
        if (this.goldGiven == false){
            this.goldGiven = true;

            if (this.type == 1){
                gold += 5;
            }

            if (this.type == 2){
                gold += 10;
            }

            if (this.type == 3){
                gold += 15;
            }

            if (slumpa(100) >= 20){
                drop.push(new Drop());
            }
        }

        delete enemy[v[1]];
    }

    if (this.goldGiven == false){

        this.jumpSpeed = 0.7 + (Math.pow(this.s / 5.2, 2));
        this.jumpSpeed2 = 0.7 + (Math.pow(this.n / 5.2, 2));

        if (this.jumpNow == true){

            if (this.s >= 0){
                this.s--;
                this.y -= this.jumpSpeed;
            }

            if (this.s < 0){
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

        for (v[4] in spelare){
            if (this.x >= spelare[v[4]].x && this.x <= spelare[v[4]].x + spelare[v[4]].w && spelare[v[4]].jumpNow == true
                && slumpa(100) >= 90 && this.type != 3 && this.alreadyJumping == false){
                this.jumpNow = true;
                this.alreadyJumping = true;
            }

        }

        for (v[5] in shots){
            if (this.x >= shots[v[5]].x && this.x <= shots[v[5]].x && slumpa(100) >= 90 && this.type != 3 && this.alreadyJumping == false){
                this.jumpNow = true;
                this.alreadyJumping = true;
            }

                if (spelare[v[4]].weapon == 1 && shots[v[5]].x >= this.x && shots[v[5]].x <= this.x + this.w && shots[v[5]].y >=
                    this.y && shots[v[5]].y <= this.y + this.h) {
                    if (spelare[v[4]].weapon == 1){
                        this.health -= shots[v[5]].damage;
                    }
                    if (slumpa(40) > 1){
                        delete shots[v[5]];
                    }
                }

                if (spelare[v[4]].weapon == 2 && spelare[v[4]].gotWeapon2 == true && shots[v[5]].x + 80 >= this.x && shots[v[5]].x <=
                    this.x + this.w + 80 && shots[v[5]].y >= this.y && shots[v[5]].y
                    <= this.y + this.h) {
                    if (spelare[v[4]].weapon == 2 && spelare[v[4]].gotWeapon2 == true){
                        this.health -= shots[v[5]].damage;
                    }
                    if (slumpa(20) > 2){
                        delete shots[v[5]];
                    }
                }

                if (spelare[v[4]].weapon == 3 && spelare[v[4]].gotWeapon3 == true && shots[v[5]].x >= this.x && shots[v[5]].x <=
                    this.x + this.w + 10 && shots[v[5]].y >= this.y && shots[v[5]].y <= this.y + this.h) {
                    if (spelare[v[4]].weapon == 3 && spelare[v[4]].gotWeapon3 == true){
                        this.health -= shots[v[5]].damage;
                    }
                    if (slumpa(20) > 2){
                        delete shots[v[5]];
                    }
                }
        }

        if (this.x < 0 - this.w){
            delete enemy[v[1]];
        }

        if (this.x > 500){
            delete enemy[v[1]];
        }

        if (this.health > this.totalHealth - 1){
            if (this.enemyGoRight == true){
                if (this.type == 1){
                    this.x += 4;
                } else {
                    this.x += 2;
                }
            } else {
                if (this.type == 1){
                    this.x -= 4;
                } else {
                    this.x -= 2;
                }
            }

        } else {
            if (this.x + slumpa(20) > spelare[0].x) {
                if (this.type == 1){
                    this.x -= 4;
                } else {
                    this.x -= 2;
                }
                this.enemyGoRight = false;
            } if (this.x - slumpa(20) < spelare[0].x) {
                if (this.type == 1){
                    this.x += 4;
                } else {
                    this.x += 2;
                }
                this.enemyGoRight = true;
            }
        }
    }

    this.a++;
    if (this.a > 30 + slumpa(40) && this.health > this.totalHealth - 1 && this.type > 1) {
        this.enemyGoRight = this.enemyGoRight == false;
        this.a = 0;
    }

    if (this.a > 10 + slumpa(40) && this.health > this.totalHealth - 1 && this.type == 1) {
        this.enemyGoRight = this.enemyGoRight == false;
        this.a = 0;
    }


};

Enemy.prototype.paint = function (ctx) {


    ctx.fillStyle = "#000000";

    if (this.totalHealth > 5){
        ctx.fillRect(this.x - 4, this.y - 10, 29 / 4 * this.totalHealth, 7);
    } else {
        ctx.fillRect(this.x - 4, this.y - 10, 31 / 4 * this.totalHealth, 7);
    }

    ctx.fillStyle = "#FF0000";

    ctx.fillRect(this.x - 2, this.y - 8, enemyOneHp * this.health, 3);

    ctx.fillStyle = "#000000";

    ctx.fillRect(this.x - 2 + enemyOneHp, this.y - 8, 1, 3);

    if (this.totalHealth > 2){
        ctx.fillRect(this.x - 2 + enemyOneHp * 2, this.y - 8, 1, 3);
    }

    if (this.totalHealth > 3){
        ctx.fillRect(this.x - 2 + enemyOneHp * 3, this.y - 8, 1, 3);
    }

    if (this.totalHealth > 4){
        ctx.fillRect(this.x - 2 + enemyOneHp * 4, this.y - 8, 1, 3);
    }

    if (this.totalHealth > 4){
        ctx.fillRect(this.x - 2 + enemyOneHp * 5, this.y - 8, 1, 3);
    }

    if (this.totalHealth > 4){
        ctx.fillRect(this.x - 2 + enemyOneHp * 6, this.y - 8, 1, 3);
    }


    if (this.jumpNow == true){
        if (this.facingRight == true){
            ctx.drawImage(enemy1_2R, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(enemy1_2L, this.x, this.y, this.w, this.h);
        }
    } else {

        if (this.ani >= 4){this.ani = 0;}

        if (this.ani > 3 && this.ani < 4){

            if (this.enemyGoRight == true){
                ctx.drawImage(enemy1_3R, this.x, this.y, this.w, this.h);
            } else {
                ctx.drawImage(enemy1_3L, this.x, this.y,this.w, this.h);
            }


            if (this.type == 3){
                this.ani += 0.05;
            } else {
                this.ani += 0.2;
            }

        }

        if (this.ani > 2 && this.ani <= 3){

            if (this.enemyGoRight == true){
                ctx.drawImage(enemy1_1R, this.x, this.y, this.w, this.h);
            } else {
                ctx.drawImage(enemy1_1L, this.x, this.y,this.w, this.h);
            }

            if (this.type == 3){
                this.ani += 0.05;
            } else {
                this.ani += 0.2;
            }

        }

        if (this.ani > 1 && this.ani <= 2){

            if (this.enemyGoRight == true){
                ctx.drawImage(enemy1_2R, this.x, this.y, this.w, this.h);
            } else {
                ctx.drawImage(enemy1_2L, this.x, this.y,this.w, this.h);
            }

            if (this.type == 3){
                this.ani += 0.05;
            } else {
                this.ani += 0.2;
            }

        }

        if (this.ani <= 1){

            if (this.enemyGoRight == true){
                ctx.drawImage(enemy1_1R, this.x, this.y, this.w, this.h);
            } else {
                ctx.drawImage(enemy1_1L, this.x, this.y,this.w, this.h);
            }

            if (this.type == 3){
                this.ani += 0.05;
            } else {
                this.ani += 0.2;
            }

        }

    }

};

function Shot(x, y, direction, weaponSpeed, lifetime, damage, shotgunW, shotgunH) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.weaponSpeed = weaponSpeed;
    this.lifetime = lifetime;
    this.damage = damage;
    this.shotgunW = shotgunW;
    this.shotgunH = shotgunH;

    for (v[4] in spelare){
        if (multiplayer == false){
            if (spelare[0].weapon == 1){
                this.damage = weaponranks[0];
            }

            if (spelare[0].weapon == 2){
                this.damage = 2 + weaponranks[1];
            }

            if (spelare[0].weapon == 3){
                this.damage = weaponranks[2];
            }

        } else {
            if (spelare[v[4]].weapon == 1){
                this.damage = 1;
            }

            if (spelare[v[4]].weapon == 2){
                this.damage = 3;
            }

            if (spelare[v[4]].weapon == 3){
                this.damage = 1;
            }

        }

    }

        if (spelare[0].fuckingMultiplayerFixerBullshitVariableBecauseICantCode == true){
            this.x = spelare[0].x + 10;
            this.y = spelare[0].y + 22;

            if (spelare[0].weapon == 1){this.weaponSpeed = 1;}
            if (spelare[0].weapon == 2 && spelare[0].gotWeapon2 == true){this.weaponSpeed = 5;}
            if (spelare[0].weapon == 3 && spelare[0].gotWeapon3 == true){this.weaponSpeed = 3;}

            if (spelare[0].facingRight == true){

                if (spelare[0].weapon == 1){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[0].w / 2 + 4, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[0].w / 2 + 4, this.y - 8);
                    }
                }

                if (spelare[0].weapon == 2){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[0].w + 7, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[0].w + 7, this.y - 8);
                    }
                }

                if (spelare[0].weapon == 3){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[0].w + 10, this.y - 8 + 2);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[0].w + 10, this.y - 8 + 2);
                    }
                }

                this.direction = this.weaponSpeed;

            } else {

                if (spelare[0].weapon == 1){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[0].w - 4, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[0].w - 4, this.y - 8);
                    }
                }

                if (spelare[0].weapon == 2){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[0].w - 17, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[0].w - 17, this.y - 8);
                    }
                }

                if (spelare[0].weapon == 3){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[0].w - 23, this.y - 8 + 2);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[0].w - 23, this.y - 8 + 2);
                    }
                }

                this.direction = -this.weaponSpeed;

            }

            spelare[0].fuckingMultiplayerFixerBullshitVariableBecauseICantCode = false;

        }
        else if (spelare[1].fuckingMultiplayerFixerBullshitVariableBecauseICantCode == true) {
            this.x = spelare[1].x + 10;
            this.y = spelare[1].y + 22;

            if (spelare[1].weapon == 1){this.weaponSpeed = 1;}
            if (spelare[1].weapon == 2 && spelare[1].gotWeapon2 == true){this.weaponSpeed = 5;}
            if (spelare[1].weapon == 3 && spelare[1].gotWeapon3 == true){this.weaponSpeed = 3;}

            if (spelare[1].facingRight == true) {

                if (spelare[1].weapon == 1){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[1].w / 2 + 4, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[1].w / 2 + 4, this.y - 8);
                    }
                }

                if (spelare[1].weapon == 2){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[1].w + 7, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[1].w + 7, this.y - 8);
                    }
                }

                if (spelare[1].weapon == 3){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionRight_1, this.x + spelare[1].w + 10, this.y - 8 + 2);
                    } else {
                        ctx.drawImage(ignitionRight_2, this.x + spelare[1].w + 10, this.y - 8 + 2);
                    }
                }

                this.direction = this.weaponSpeed;

            } else {

                if (spelare[1].weapon == 1){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[1].w - 4, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[1].w - 4, this.y - 8);
                    }
                }

                if (spelare[1].weapon == 2){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[1].w - 17, this.y - 8);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[1].w - 17, this.y - 8);
                    }
                }

                if (spelare[1].weapon == 3){
                    if (slumpa(2) == 1){
                        ctx.drawImage(ignitionLeft_1, this.x - spelare[1].w - 23, this.y - 8 + 2);
                    } else {
                        ctx.drawImage(ignitionLeft_2, this.x - spelare[1].w - 23, this.y - 8 + 2);
                    }
                }

                this.direction = -this.weaponSpeed;
            }

            spelare[1].fuckingMultiplayerFixerBullshitVariableBecauseICantCode = false;

        }

    this.lifetime = 0;
    this.shotgunW = 1;
    this.shotgunH = 1;
}

Shot.prototype.updatePosition = function () {

    if (this.shotgunH < 14){
        this.shotgunH += 0.5;
        this.shotgunW += 0.5;
    }

    for (v[4] in spelare){
        if (this.direction == this.weaponSpeed){
            this.x += this.weaponSpeed;
        } else {this.x -= this.weaponSpeed;}

        this.lifetime++;

        if (this.lifetime >= 20 ){
            this.y += Math.pow(this.lifetime / (15 * 60), 2);
        }

        if (this.y > 432){
            delete shots[v[5]];
        }

    }

};

Shot.prototype.paint = function (ctx) {

    ctx.fillStyle="#6E6E6E";

    if (this.weaponSpeed == 1){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        if (this.direction == 1){
            ctx.fillRect(this.x - 5, this.y - 2, 5, 4);
        } else {
            ctx.fillRect(this.x, this.y - 2, 5, 4);
        }
    }

    if (this.weaponSpeed == 5){
        ctx.drawImage(shotgun, this.x, this.y - this.shotgunH / 2, this.shotgunW, this.shotgunH);
    }

    if (this.weaponSpeed == 3){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        if (this.direction == 1){
            ctx.fillRect(this.x - 7, this.y - 2, 7, 4);
        } else {
            ctx.fillRect(this.x, this.y - 2, 7, 4);
        }
    }
};

function Weather (x, y, direction, lifetime, collision, speed, radius, levelWeather, color){
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.lifetime = lifetime;
    this.collision = collision;
    this.speed = speed;
    this.radius = radius;
    this.levelWeather = levelWeather;
    this.color = color;

    this.x = slumpa(700);
    this.y = 10;
    this.lifetime = 0;
    this.collision = false;
    this.speed = slumpa(2);
    this.radius = slumpa(3);
    this.levelWeather = level;
    this.color = slumpa(5);

}

Weather.prototype.updatePosition = function () {

    if (slumpa(1000) == 100){
        delete weather[v[0]];
    }

    for (v[3] in object2){
        if ((object2[v[3]].y - 5) + slumpa(10) <= this.y && object2[v[3]].y + object2[v[3]].h >= this.y && this.x >= object2[v[3]].x && object2[v[3]].x + object2[v[3]].w >= this.x){
            this.collision = true;
        }
    }

    if (this.speed < 5){
        this.direction = slumpa(3);
    }

    if (this.y < 430 + slumpa(10) && this.collision == false ){
        this.y += this.speed;
        if (this.direction == 1){
            this.x++;
        } else {
            this.x--;
        }
    } else if (this.collision == false) {
        this.collision = true;
    }

    if (this.collision == true){
        this.lifetime++;
    }

    if (this.speed < 5){
        if (this.lifetime > 200){
            delete weather[v[0]];
        }
    } else if (this.lifetime >= 10) {
        delete weather[v[0]];
    }
};

Weather.prototype.paint = function (ctx) {

    ctx.beginPath();

    // Snö eller Regn.
    if (this.speed < 5){

        if (this.color == 1){
            ctx.fillStyle="#FAFAFA";
        }

        if (this.color == 2){
            ctx.fillStyle="#FFFFFF";
        }

        if (this.color == 3){
            ctx.fillStyle="#F2F2F2";
        }

        if (this.color > 3){
            ctx.fillStyle="#FFFFFF";
        }

    } else if (this.speed > 5){
        ctx.fillStyle="#2E64FE";
    }

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
};

function Drop (x, y, w, h, type, blink, levelBox) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.blink = blink;
    this.levelBox = levelBox;

    if (level != 3){
        this.x = enemy[v[1]].x + enemy[v[1]].w / 2 - 7;
        this.y = 420;
    } else {
        this.x = 50 + slumpa(400);
        this.y = 200;
    }
    this.w = 15;
    this.h = 15;
    this.type = slumpa(5);
    this.blink = 0;
    this.levelBox = level;
}

Drop.prototype.updatePosition = function () {

    for (v[3] in object2){
        if (this.x + this.w > object2[v[3]].x + 3 && this.x < object2[v[3]].x + object2[v[3]].w - 3 && this.y + this.h >= object2[v[3]].y
            && this.y + this.h < object2[v[3]].y + 5 ){

        }  else if (this.y < 420) {
            this.y += 2;
        }
    }

    for (v[0] in weather){
        if (weather[v[0]].speed == 2 && weather[v[0]].y + 1 >= this.y && this.x <=
            weather[v[0]].x && this.x + this.w >= weather[v[0]].x && slumpa(100) > 20 && this.levelBox == level){
            weather[v[0]].collision = true;
        }
    }

    for (v[4] in spelare){
        if (spelare[v[4]].x + spelare[v[4]].w >= this.x && spelare[v[4]].x <= this.x + 10
            && spelare[v[4]].y + spelare[v[4]].h >= this.y + 10 && spelare[v[4]].y + spelare[v[4]].h >= this.y + this.h){
            delete drop[v[8]];

            if (this.type == 1){
                spelare[v[4]].weapon1[1]++;
            }

            if (this.type == 2){
                spelare[v[4]].weapon2[1]++;
            }

            if (this.type == 3){
                spelare[v[4]].weapon3[1]++;
            }

            if (this.type == 4){
                spelare[v[4]].health += 2;
            }

            if (this.type == 5){
                spelare[v[4]].gotWeapon2 = true;
            }
        }
    }
};

Drop.prototype.paint = function (ctx) {
    if (this.type <= 1){
        ctx.drawImage(box1, this.x, this.y, this.w, this.h);
    }

    if (this.type == 2){
        ctx.drawImage(box2, this.x, this.y, this.w, this.h);
    }

    if (this.type == 3){
        ctx.drawImage(box3, this.x, this.y, this.w, this.h);
    }

    if (this.type == 4){
        ctx.drawImage(vapen3_spelare, this.x, this.y, this.w, this.h - 5);
    }

    if (this.type >= 5){
        ctx.drawImage(vapen2_spelare, this.x, this.y, this.w, this.h - 5);
    }

    this.blink += 0.05;

    if (this.blink >= 2){
        ctx.fillStyle="#FFFF00";
        ctx.fillRect(this.x, this.y, this.w / 12, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h / 12);
        ctx.fillRect(this.x + this.w - this.w / 12, this.y, this.w / 12, this.h);
        ctx.fillRect(this.x, this.y + this.h - this.h / 12, this.w, this.h / 12);
    }

    if (this.blink >= 4){
        this.blink = 0;
    }

};

function Shop (x, y){
    this.x = x;
    this.y = y;

    this.x = 160;
    this.y = 346;
}

Shop.prototype.paint = function (ctx) {

    ctx.fillStyle="#000000";

    ctx.fillText("500G",this.x, this.y - 43);

    ctx.fillStyle="#000000";

    ctx.drawImage(vapen3_spelare,this.x - 10, this.y - 40, 60, 20);


    if (spelare[0].gotWeapon3 == true){
        ctx.drawImage(doorMid, this.x, this.y, 35, 35);
        ctx.drawImage(doorTop, this.x, this.y - 35, 35, 35);
    } else {
        ctx.drawImage(doorMidClosed, this.x, this.y, 35, 35);
        ctx.drawImage(doorTopClosed, this.x, this.y - 35, 35, 35);
    }

    ctx.fillText("200G",this.x + 150, this.y - 43);

    ctx.fillStyle="#000000";

    ctx.drawImage(vapen2_spelare,this.x + 140, this.y - 40, 60, 20);

    if (spelare[0].gotWeapon2 == true){
        ctx.drawImage(doorMid, this.x + 150, this.y, 35, 35);
        ctx.drawImage(doorTop, this.x + 150, this.y - 35, 35, 35);
    } else {
        ctx.drawImage(doorMidClosed, this.x + 150, this.y, 35, 35);
        ctx.drawImage(doorTopClosed, this.x + 150, this.y - 35, 35, 35);
    }
};

function Object2 (x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Object2.prototype.paint = function () {

    if (level != 2){
        this.x = 100;
        this.y = 380;
        this.w = 9 * 35;
        this.h = 10;
    } else {
        this.x = -200;
        this.y = 420;
        this.w = 3 * 35;
        this.h = 10;
    }

    if (level != 2){
        if (this.w >= 105){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 35, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 35, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 140){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 70, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 70, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 175){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 105, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 105, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 210){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 140, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 140, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 245){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 175, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 175, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 280){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 35 + 175, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 35 + 175, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 315){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 70 + 175, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 70 + 175, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 350){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 280, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 280, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 385){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 35 + 280, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 35 + 280, this.y - 5, 35, 35);
            }

        }

        if (this.w >= 420){

            if (level == 3){
                ctx.drawImage(stoneCenter, this.x + 70 + 280, this.y - 5, 35, 35);
            } else {
                ctx.drawImage(grass, this.x + 70 + 280, this.y - 5, 35, 35);
            }

        }

        if (level == 3){
            ctx.drawImage(stoneCliffLeft, this.x, this.y -  5, 35, 35);
            ctx.drawImage(stoneCliffRight, this.x + this.w - 35, this.y - 5, 35, 35);
        } else {
            ctx.drawImage(grassCliffLeft, this.x, this.y -  5, 35, 35);
            ctx.drawImage(grassCliffRight, this.x + this.w - 35, this.y - 5, 35, 35);
        }

    }
};

function Boss (x, y, w, h, direction, timer, hitYourLazer, shootDelay, counter1,health, doOnce,
               makeLazor, initLazor, facingRight, ani, soundtimer, damageSize, movefaster){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.direction = direction;
    this.timer = timer;
    this.hitYourLazer = hitYourLazer;
    this.shootDelay = shootDelay;
    this.counter1 = counter1;
    this.health = health;
    this.doOnce = doOnce;
    this.makeLazor = makeLazor;
    this.initLazor = initLazor;
    this.facingRight = facingRight;
    this.ani = ani;
    this.soundtimer = soundtimer;
    this.damageSize = damageSize;
    this.movefaster = movefaster;

    this.x = 200;
    this.y = 200;
    this.w = 74;
    this.h = 54;
    this.direction = slumpa(6);
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

Boss.prototype.updatePosition = function () {

    for (v[4] in spelare){

        if (this.x <= spelare[v[4]].x + spelare[v[4]].w && this.x + this.w >= spelare[v[4]].x && slumpa(50) == 1
            && this.shootDelay == false){

            if (this.makeLazor == false){
                this.makeLazor = true;
            }
        }

        if (this.x + 25 <= spelare[v[4]].x + spelare[v[4]].w && this.x + this.w >= spelare[v[4]].x + 25 && this.shootDelay == false
            && this.initLazor >= 10 && spelare[v[4]].damageDelay == false){

            spelare[v[4]].health--;
            spelare[v[4]].damageDelay = true;
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

    for (v[4] in spelare){

        if (spelare[v[4]].x > this.x && this.facingRight == false){
            this.movefaster = 15;
        } else if (this.x > spelare[v[4]].x && this.facingRight == true){
            this.movefaster = 15;
        }


        if (this.x < spelare[v[4]].x && this.facingRight == true){
            this.movefaster = 0;
            if (slumpa(1000) > 850 && level == 3){
                bossprojectile.push(new Bossprojectile());
                if (this.soundtimer == 0){
                    dragonSound.play('fire');
                    this.soundtimer = 1;
                }
            }
        } else if (this.x > spelare[v[4]].x && this.facingRight == false){
            this.movefaster = 0;
            if (slumpa(1000) > 850 && level == 3){
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
    if (slumpa(300) == 1){
        bossdrop.push(new Bossdrop());
    }

    if (this.shootDelay == true){
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
        this.direction = slumpa(6);
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

    if (dif == 0){
        ctx.fillStyle="#000000";
        ctx.fillRect(35, 66, 20 * 20 + 8, 19);

        ctx.fillStyle="#FF0000";
        ctx.fillRect(39, 70, 20 * this.health, 11);

    }

    if (this.makeLazor == true && this.initLazor >= 10){
        ctx.fillStyle="#F3F781";
        ctx.fillRect(this.x + this.w / 2 - 15, this.y + 60, 30, this.hitYourLazer);

    }

    if (this.makeLazor == true){
        this.initLazor++;
        ctx.fillStyle="#F3F781";
        ctx.fillRect(this.x + this.w / 2 - 5, this.y + 60, 10, this.hitYourLazer);
    }

    if (this.facingRight == true){
        if (this.ani < 4){
            ctx.drawImage(boss1_right1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 8){
            ctx.drawImage(boss1_right2,this.x, this.y, this.w, this.h);

        } else if (this.ani < 12){
            ctx.drawImage(boss1_right1,this.x, this.y, this.w, this.h);

        } else if (this.ani < 16){
            ctx.drawImage(boss1_right3,this.x, this.y, this.w, this.h);
        }
    } else {
        if (this.ani < 4){
            ctx.drawImage(boss1_left1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 8){
            ctx.drawImage(boss1_left2,this.x, this.y, this.w, this.h);
        } else if (this.ani < 12){
            ctx.drawImage(boss1_left1,this.x, this.y, this.w, this.h);
        } else if (this.ani < 16){
            ctx.drawImage(boss1_left3,this.x, this.y, this.w, this.h);
        }
    }
};

function Bossdrop (x, y, fallingSpeed, lifetime, falling) {
    this.x = x;
    this.y = y;
    this.w = 23;
    this.h = 33;
    this.fallingSpeed = fallingSpeed;
    this.lifetime = lifetime;
    this.falling = falling;

    for (v[6] in boss){
        this.x = boss[v[6]].x + boss[v[6]].w / 2;
        this.y = boss[v[6]].y + boss[v[6]].h - this.h;
    }
    this.fallingSpeed = 1 + slumpa(4);
    this.lifetime = 0;
    this.falling = true;
}

Bossdrop.prototype.paint = function () {
    ctx.drawImage(bossdropImage, this.x, this.y);

    if (this.lifetime > 25){
        ctx.drawImage(crack1, this.x, this.y);
    }

    if (this.lifetime > 50){
        ctx.drawImage(crack2, this.x, this.y);
    }

    if (this.lifetime > 75){
        ctx.drawImage(crack3, this.x, this.y);
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

    for (v[4] in spelare){
        if (spelare[v[4]].x + spelare[v[4]].w >= this.x && spelare[v[4]].x < this.x + this.w && this.y + this.h >=
            spelare[v[4]].y && this.y <= spelare[v[4]].y + spelare[v[4]].h){
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

    for (v[3] in object2){
        if (this.x + this.w >= object2[v[3]].x && this.x <= object2[v[3]].x + object2[v[3]].w && this.y + this.h >= object2[v[3]].y){
            this.falling = false;
        }
    }

    if (this.y < 400 && this.falling == true){
        this.y += this.fallingSpeed;
    } else {
        this.lifetime++;
    }
};

function Bossprojectile(x, y, h, w, direction, collision, lifetime, ani, ignoreObject2) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.direction = direction;
    this.collision = collision;
    this.lifetime = lifetime;
    this.ani = ani;
    this.ignoreObject2 = ignoreObject2;

    this.h = 20;
    this.w = 20;
    for (v[6] in boss){
        this.x = boss[v[6]].x;
        this.y = boss[v[6]].y + boss[v[6]].h / 2;

        if (boss[v[6]].facingRight == true){
            this.direction = 1;
            this.x += boss[v[6]].w - this.w;
        } else {
            this.direction = 0;
        }
    }

    this.collision = false;
    this.lifetime = 0;
    this.ani = slumpa(20);

    for (v[4] in spelare){
        if (spelare[v[4]].y < 370){
            this.ignoreObject2 = false;
        } else {
            this.ignoreObject2 = true;
        }
    }
}

Bossprojectile.prototype.updatePosition = function () {

    this.ani += 2;

    if (this.ani >= 20){
        this.ani = 0;
    }

    if (level != 3){
        delete bossprojectile[v[9]];
    }

    for (v[4] in spelare){
        if (spelare[v[4]].x + spelare[v[4]].w >= this.x && spelare[v[4]].x <= this.x + 10 && spelare[v[4]].damageDelay == false
            && spelare[v[4]].y <= this.y + this.h && spelare[v[4]].y + spelare[v[4]].h > this.y){
            delete bossprojectile[v[9]];

            spelare[v[4]].health--;
            spelare[v[4]].damageDelay = true;
        }
    }

    if (this.y > 410){
        this.collision = true;
    }

    for (v[3] in object2){
        if (this.x + this.w > object2[v[3]].x + 3 && this.x < object2[v[3]].x + object2[v[3]].w - 3 && this.y + this.h >= object2[v[3]].y
            && this.y + this.h < object2[v[3]].y + 5 && this.collision == false && this.ignoreObject2 == false){
            this.collision = true;

        }  else if (this.y < 420 && this.collision == false) {
            this.y += 4;

            if (this.direction == 1){
                this.x += 3;
            } else {
                this.x -= 3;
            }

        } else if (this.collision == true){
            this.lifetime++;
            if (this.lifetime > 10){
                delete bossprojectile[v[9]];
            }
        }
    }
}

Bossprojectile.prototype.paint = function (ctx) {

    if (this.direction == 1){

        if (this.ani >= 10){
            ctx.drawImage(bossprojectile_right, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(bossprojectile_right_2, this.x, this.y, this.w, this.h);
        }


    } else {
        if (this.ani >= 10){
            ctx.drawImage(bossprojectile_left, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(bossprojectile_left_2, this.x, this.y, this.w, this.h);
        }
    }

};

function Chicken(x, y, w, h, direction, va) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.direction = direction;
    this.v = va;

    for (v[7] in bossdrop){
        this.x = bossdrop[v[7]].x;
        this.y = bossdrop[v[7]].y;
    }
    this.w = 36;
    this.h = 25;
    this.direction = slumpa(2);
    this.va = [0, 0, 0, 0];

    if (slumpa(100) >= 50){
        chickenSound.play("spawn1");

    } else {
        chickenSound.play("spawn2");
    }

}

Chicken.prototype.updatePosition = function () {

    this.va[0]++;
    this.va[1]++;

    for (v[5] in shots){
        if (shots[v[5]].x >= this.x && shots[v[5]].x <= this.x + this.w && shots[v[5]].y + 5 >=
            this.y && shots[v[5]].y <= this.y + this.h) {
            delete chicken[v[10]];
            if (slumpa(40) > 1){
                delete shots[v[5]];
            }
        }
    }

    if (level != 3){
        delete chicken[v[10]];
    }

    if (bossdead == true){
        delete chicken[v[10]];
    }

    for (v[4] in spelare){
        if (spelare[v[4]].x + spelare[v[4]].w >= this.x && spelare[v[4]].x <= this.x + this.w && spelare[v[4]].damageDelay == false
            && this.y + this.h >= spelare[v[4]].y && spelare[v[4]].y + spelare[v[4]].h >= this.y){

            this.va[2]++;
            spelare[v[4]].health--;
            spelare[v[4]].damageDelay = true;
        }
    }

    if (this.va[0] > 20 + slumpa(35)){
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

    if (this.va[2] > 20){
        delete chicken[v[10]];
    }

    for (v[3] in object2){
        if (this.x + this.w > object2[v[3]].x + 3 && this.x < object2[v[3]].x + object2[v[3]].w - 3 && this.y + this.h >= object2[v[3]].y
            && this.y + this.h < object2[v[3]].y + 5 ){

            if (this.va[2] == 0){
                this.direction = slumpa(2);
                this.va[2] = 1;
            }

        }  else if (this.y < 420) {
            this.va[2] = 0;
            this.y += 2;
            this.direction = -10;
        }
    }

    if (this.direction == 1){
        this.x += 2;
    } else if (this.direction > 0){
        this.x -= 2;
    }
};

Chicken.prototype.paint = function (ctx) {

    if (this.direction == 1){
        ctx.drawImage(chickenImage, this.x, this.y, this.w, this.h);
    } else {
        ctx.drawImage(chickenImage_flip, this.x, this.y, this.w, this.h);
    }
};
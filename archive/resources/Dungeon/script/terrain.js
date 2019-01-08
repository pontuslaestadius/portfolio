var bw1 = 117;
var tw1 = 112;
var rw1 = 155;
var lw1 = 198;
var blc1 = 106;
var trc1 = 109;
var brc1 = 172;
var tlc1 = 113;
var tloc1 = 142;
var troc1 = 143;
var bloc1 = 144;
var broc1 = 145;
var moss1 = 0.12;
var moss2 = 0.13;
var moss3 = 0.14;
var t1_2 = 0.15;
var t1_3 = 0.16;
var cf1 = 197;
var roomSize = 0;
var path = 0;
var extraX = 0;
var extraY = 0;
var someX = 0;
var someY = 0;

var doorX = 5;
var doorY = 5;

function decideTerrain(){



    for(var j = 0; j < 80; j++){

        if (j == 0){
            player[0].x = 3 + someX + extraX;
            player[0].y = 3 + someY + extraY;
        }

        map1[3 + someY + extraY][3 + someX + extraX] = 0;

        if (slumpa(100) >= 50){
            if (slumpa(100) >= 50){
                if (3 + someX + extraX < 27 && map1[3 + someY + extraY][3 + someX + extraX +1] != 0){
                    extraX++;
                }

            } else {
                if (3 + someX + extraX > 3 && map1[3 + someY + extraY][3 + someX + extraX -1] != 0){
                    extraX--;
                }
            }
        } else {
            if (slumpa(100) >= 50){
                if (3 + someY + extraY < 27 && map1[3 + someY + extraY +1][3 + someX + extraX] != 0){
                    extraY++;
                }
            } else {
                if (3 + someY + extraY > 3 && map1[3 + someY + extraY -1][3 + someX + extraX] != 0){
                    extraY--;
                }
            }

        }

        if (j == 79){
            doorX = 3 + someX + extraX;
            doorY = 3 + someY + extraY;
        }

    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            if (map1[j][i] == 1 && slumpa(900) > 890 && j > 4 && i > 4 && 26 > j && 26 > i){

                roomSize = slumpa(3);

                for (var z = 0; z < roomSize +1; z++){
                    for (var y = 0; y < roomSize +1; y++){
                        map1[j +(z -1)][i +(y -1)] = 0;
                        map1[j -(z -1)][i -(y -1)] = 0;
                    }
                }

            }
        }
    }
    /*
    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

                if (map1[j][i] == 0 && map1[j][i +1] == 0 && map1[j][i -1] == 0 && map1[j -1][i] == 0 && map1[j +1][i] == 0){
                    player[0].x = i;
                    player[0].y = j;
                }

            if (map1[j][i] == 0 && slumpa(900) >= 895){
                doorX = i;
                doorY = j;
            }
        }
    }
    */
    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            if(map1[j][i]==0 && map1[j +1][i] == 1){
                map1[j +1][i] = bw1;
            }

            if(map1[j][i]==0 && map1[j -1][i] == 1){
                map1[j -1][i] = tw1;
            }

            if(map1[j][i]==0 && map1[j][i +1] == 1){
                map1[j][i +1] = rw1;
            }

            if(map1[j][i]==0 && map1[j][i -1] == 1){
                map1[j][i -1] = lw1;
            }

            if(map1[j][i]==bw1 && map1[j][i +1] == 0 && map1[j +1][i] != 0){
                map1[j][i] = blc1;
            }

            if(map1[j][i]==bw1 && map1[j][i -1] == 0 && map1[j +1][i] != 0){
                map1[j][i] = brc1;
            }

            if(map1[j][i] == rw1 && map1[j +1][i] == 0 && map1[j -1][i] != 0){
                map1[j][i] = trc1;
            }

            if(map1[j][i +1] == 0 && map1[j +1][i] == 0 && map1[j][i] != 0 && map1[j -1][i] != 0){
                map1[j][i] = tlc1;
            }

            if(map1[j][i +1] == 0 && map1[j +1][i] == 0 && map1[j][i] != 0){
                map1[j][i] = tlc1;
            }

            if(map1[j][i] == 0 && map1[j -1][i] > 1 && map1[j][i -1] > 1){
                map1[j -1][i -1] = tloc1;
            }

            if(map1[j][i] == 0 && map1[j -1][i] > 1 && map1[j][i +1] > 1){
                map1[j -1][i +1] = troc1;
            }

            if(map1[j][i] == 0 && map1[j +1][i] > 1 && map1[j][i -1] > 1){
                map1[j +1][i -1] = bloc1;
            }

            if(map1[j][i] == 0 && map1[j +1][i] > 1 && map1[j][i +1] > 1){
                map1[j +1][i +1] = broc1;
            }

        }
    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            if (map1[j][i] == 0){

                if (map1[j +1][i] != 0 &&
                    map1[j +1][i +1] == 0 && map1[j +1][i -1] == 0 &&
                    map1[j][i +1] == 0){
                    map1[j +1][i] = 0;
                }

                if (map1[j][i +2] == 0){

                    if (map1[j][i +1] == lw1 && slumpa(100) > 10){
                        map1[j][i +1] = 0;


                    }

                    if (map1[j][i +1] == rw1 && slumpa(100) > 10){
                        map1[j][i +1] = 0;


                    }

                }

                if (map1[j +2][i] == 0){

                    if (map1[j +1][i] == tw1 && slumpa(100) > 10){
                        map1[j +1][i] = 0;

                    }

                    if (map1[j +1][i] == bw1 && slumpa(100) > 10){
                        map1[j +1][i +1] = 0;

                    }

                }

            }

        }
    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            if (map1[j][i] == 0){

                if (map1[j +1][i] != 0 &&
                    map1[j +1][i +1] == 0 && map1[j +1][i -1] == 0 &&
                    map1[j][i +1] == 0){
                    map1[j +1][i] = 0;
                }

                if (slumpa(100) >= 95){
                    map1[j][i] = moss1;
                } else if (slumpa(100) >= 95){
                    map1[j][i] = moss2;
                } else if (slumpa(100) >= 95){
                    map1[j][i] = moss3;
                } else if (slumpa(100) >= 99){
                    map1[j][i] = t1_2;
                } else if (slumpa(100) >= 99){
                    map1[j][i] = t1_3;
                }
            }
        }
    }

    /*
    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(slumpa(1000) > 950){
                if (map1[j][i]== tw1){
                    map1[j][i] = cf1;
                    cannon.push(new Cannon(i, j));

                } else if (map1[j][i]== bw1) {
                    map1[j][i] = cf1;
                    cannon.push(new Cannon(i, j));
                } else if (map1[j][i]== lw1) {
                    map1[j][i] = cf1;
                    cannon.push(new Cannon(i, j));
                } else if (map1[j][i]== rw1) {
                    map1[j][i] = cf1;
                    cannon.push(new Cannon(i, j));
                }

            }

        }

    }
    */


    map1[doorY][doorX] = 0;

}

function makeTerrain(){

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            // Svart
            if(map1[j][i]==1){
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Tegel
            if(map1[j][i]==0){
                ctx.drawImage(tiles1, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Tegel2
            if(map1[j][i]==t1_2){
                ctx.drawImage(tiles1_2, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Tegel3
            if(map1[j][i]==t1_3){
                ctx.drawImage(tiles1_3, i*boardSize, j*boardSize, boardSize, boardSize);
            }


            // moss
            if(map1[j][i]==moss1){
                ctx.drawImage(tiles1_moss, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // moss2
            if(map1[j][i]==moss2){
                ctx.drawImage(tiles1_moss2, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // moss3
            if(map1[j][i]==moss3){
                ctx.drawImage(tiles1_moss3, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Bottom wall
            if(map1[j][i]==bw1){
                ctx.drawImage(tiles1_wall_bottom1, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Top wall
            if(map1[j][i]==tw1){
                ctx.drawImage(tiles1_wall_top1, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // BottomLeft corner
            if(map1[j][i]==blc1){
                ctx.drawImage(tiles1_corner_bottomLeft, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // TopRight corner
            if(map1[j][i]==trc1){
                ctx.drawImage(tiles1_corner_topRight, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // BottomRight corner
            if(map1[j][i]==brc1){
                ctx.drawImage(tiles1_corner_bottomRight, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Right wall
            if(map1[j][i]==rw1){
                ctx.drawImage(tiles1_wall_right1, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // Left wall
            if(map1[j][i]==lw1){
                ctx.drawImage(tiles1_wall_left1, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // topLeft corner
            if(map1[j][i]==tlc1){
                ctx.drawImage(tiles1_corner_topLeft, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // topLeft opposite corner
            if(map1[j][i]==tloc1){
                ctx.drawImage(tiles1_oc_topLeft, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // topRight opposite corner
            if(map1[j][i]==troc1){
                ctx.drawImage(tiles1_oc_topRight, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // bottomLeft opposite corner
            if(map1[j][i]==bloc1){
                ctx.drawImage(tiles1_oc_bottomLeft, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // bottomRight opposite corner
            if(map1[j][i]==broc1){
                ctx.drawImage(tiles1_oc_bottomRight, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            // default
            if(map1[j][i]==1){
                ctx.drawImage(tiles1_default, i*boardSize, j*boardSize, boardSize, boardSize);
            }

            /*
            // cannon
            for (c in cannon){
                cannon[c].paint(ctx);
            }
            */


            // door
            ctx.drawImage(tiles1_door, doorX*boardSize, doorY*boardSize, 16, 16);


        }
    }
}
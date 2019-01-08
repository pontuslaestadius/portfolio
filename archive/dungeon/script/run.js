var c, ctx;
var boardSize = 16;
var speed = 1;
//var w = 1;
//var placeBombDelay = [0, 0, 0, 0, 0];
var score = 0;
var time = 0;
var gamespeed = 50;

function run() {
  //Hänvisa till målarduken
  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");
  /*
    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){

            if (slumpa(1000) > 980 && map1.length -2 > j && map1[0].length - 2 > i && i < 33){
                map1[j][i]=1;
                map1[j][i +1]=1;
                map1[j][i +2]=1;
                map1[j+1][i +2]=1;
                map1[j+2][i +2]=-3;

                j += 2;
                i += 2;

              /*

                 0 -1 1 1 0 0
                 0 0 1 0 0
                 0 0 -3 0 0



            } else if (slumpa(1000) > 980 && map1.length -2 > j && map1[0].length - 2 > i && j > 2 && i < 33){
                map1[j][i]=-1;
                map1[j][i +1]=1;
                map1[j][i +2]=1;
                map1[j-1][i +2]=1;
                map1[j-2][i +2]=-2;

                i += 2;

              /*

                 0 0 -2 0 0
                 0 0 1 0 0
                 0 -1 1 1 0 0
                 0 0 0 0 0



            } else {
                if (map1[j][i -1]==1){
                    if(slumpa(100) > 50){
                        map1[j][i]=1;
                    }
                } else {
                    if(slumpa(100) > 70){
                        map1[j][i]=1;
                    }
                }
            }
        }
    }

*/

              // Kör gameloop cirka 33 ggr per sekund
              window.setInterval(gameloop, gamespeed);

              player[0] = new Player(1, 15);

              decideTerrain();
            }

function gameloop() {
  updatePositions();
  repaint();
}

function updatePositions() {

  time += 1 / gamespeed;

  if (doorX == player[0].x && doorY == player[0].y){

    player[0].displayX = player[0].x;
    player[0].displayY = player[0].y;
    player[0].transition = [0,0,0,0];

    score++;

    map1 = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
    ];
    decideTerrain();
  }

  document.getElementById("test1").innerHTML = "Score: " + score + " Tid: " + Math.round(time);

  for (c in cannon){
    cannon[c].update();
  }

  for (p in player){
    player[p].update();
  }

  //Ändra föremålens positioner.
  for (e in enemy){
    enemy[e].updatePosition();
  }

  /*
    if (placeBombDelay[0] == 1){
        placeBombDelay[1]++;

        if (placeBombDelay[1] > 20){
            placeBombDelay[4] = 1;
            placeBombDelay[1] = 0;
        }

        if (placeBombDelay[4] == 1 && placeBombDelay[1] >= 4){
            placeBombDelay[1] = 0;
            placeBombDelay[2] += 1;
        }
    }
    */
}

function repaint() {
  ctx.clearRect(0, 0, c.width, c.height);

  makeTerrain();

  /*
    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(map1[j][i]==4){

                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 3;
                    map1[j +1][i] = 3;
                    map1[j -1][i] = 3;
                    map1[j][i +1] = 3;
                    map1[j][i -1] = 3;
                }

                ctx.fillStyle = "rgb(0,255,0)";
                ctx.fillRect(i*boardSize, j*boardSize, boardSize, boardSize);
            }
        }
    }

    if (placeBombDelay[3] > 0){
        placeBombDelay[2] = 0;
        placeBombDelay[3] = 0;

    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(map1[j][i]==3){

                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 2;
                    map1[j +1][i] = 2;
                    map1[j -1][i] = 2;
                    map1[j][i +1] = 2;
                    map1[j][i -1] = 2;

                }

                ctx.fillStyle = "rgb(150,255,0)";
                ctx.fillRect(i*boardSize, j*boardSize, boardSize, boardSize);
            }
        }
    }

    if (placeBombDelay[3] > 0){
        placeBombDelay[2] = 0;
        placeBombDelay[3] = 0;

    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(map1[j][i]==2){


                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 0;

                }


                ctx.fillStyle = "rgb(255,255,0)";
                ctx.fillRect(i*boardSize, j*boardSize, boardSize, boardSize);
            }
        }
    }



    if (placeBombDelay[3] > 0){
        placeBombDelay[0] = 0;
        placeBombDelay[1] = 0;
        placeBombDelay[2] = 0;
        placeBombDelay[3] = 0;
        placeBombDelay[4] = 0;

    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(map1[j][i]==-1){


                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 0;

                }


                ctx.fillStyle = "rgb(100,90,80)";
                ctx.beginPath();
                ctx.arc(i*boardSize + boardSize / 2, j*boardSize + boardSize / 2, boardSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.fillRect(i*boardSize + boardSize / 2, j*boardSize, boardSize / 2, boardSize);
            }
        }
    }

    for(var j = 0; j < map1.length; j++){
        for(var i = 0; i < map1[0].length; i++){
            if(map1[j][i]==-2){


                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 0;

                }


                ctx.fillStyle = "rgb(100,90,80)";
                ctx.beginPath();
                ctx.arc(i*boardSize + boardSize / 2, j*boardSize + boardSize / 2, boardSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.fillRect(i*boardSize, j*boardSize + boardSize  / 2, boardSize, boardSize / 2);
            }

            if(map1[j][i]==-3){


                if (placeBombDelay[2] > 0){
                    placeBombDelay[3] = 1;
                    map1[j][i] = 0;

                }


                ctx.fillStyle = "rgb(100,90,80)";
                ctx.beginPath();
                ctx.arc(i*boardSize + boardSize / 2, j*boardSize + boardSize / 2, boardSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.fillRect(i*boardSize, j*boardSize, boardSize, boardSize / 2);
            }
        }
    }
    */

  for (e in enemy){
    enemy[e].paint(ctx);

  }

  for (p in player){
    player[p].paint(ctx);
  }

}

function keyDown(e){
  //Upp
  if(e.keyCode == 38){
    if(map1[player[0].y - 1][player[0].x] < 1){
      player[0].v[2] = 1;
      //player[0].y--;
    }
  }

  //Ner
  if(e.keyCode == 40){
    if(map1[player[0].y + 1][player[0].x] < 1){
      player[0].v[3] = 1;
      //player[0].y++;
    }
  }

  //Vänster
  if(e.keyCode == 37){
    if(map1[player[0].y][player[0].x - 1] < 1){
      player[0].v[1] = 1;
      //player[0].x--;
    }
  }

  //Höger
  if(e.keyCode == 39){
    if(map1[player[0].y][player[0].x + 1] < 1){
      player[0].v[0] = 1;
      //player[0].x++;
    }
  }
}

function keyUp(e){
  //Upp
  if(e.keyCode == 38){
    player[0].v[2] = 0;

  }

  //Ner
  if(e.keyCode == 40){
    player[0].v[3] = 0;
  }

  //Vänster
  if(e.keyCode == 37){
    player[0].v[1] = 0;
  }

  //Höger
  if(e.keyCode == 39){
    player[0].v[0] = 0;
  }
}

function slumpa(max){
  return Math.round(Math.random()*max)
}

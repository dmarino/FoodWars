/**Copyright (c) 2020, Daniela Marino*/

'use strict';
import {SQUARE_STATE, MAP_SIZE,STASH_DIRECTIONS, JAM_SOURCE} from './Constants.js'

export default class Map{

    constructor(){

        this.generateMap();
    }

    //this method generates the map in the interface
    generateMap(){
    
        //here i create every row, there are 10
        for (var i = 0; i < MAP_SIZE; i++) {

            var row = document.createElement('div');
            row.setAttribute("class", "row");

            //now i create the columns on every row, there are also 10
            for (var j = 0; j < MAP_SIZE; j++) {
                //now, every element is a td 
                var slot = document.createElement('div');
                //here i make them from class slot so i can put style on them
                slot.setAttribute("class", "slot");
                //i also put them a unique id to know the specific position of a click, and do specific things with the images
                slot.setAttribute("id", i+"-"+j);

                var image = document.createElement('img');
                slot.append(image);

                row.append(slot);
            }

            $("#board").append(row);
        }
    }


    //shows the map with the stash placed
    showMapStash(player){
        for (var i = 0; i < MAP_SIZE; i++) {

            for (var j = 0; j < MAP_SIZE; j++) {

                var str = "#" + i+"-" + j;

                if(player.map[i][j]== SQUARE_STATE.WATER){
                    $(str).children().hide();
                }
                else{
                    $(str).children().attr("src", player.giveCandySource());
                    $(str).children().show();
                }
            }
        }
    }


    //shows the map when the game is on
    showMapGame(player){

        for (var i = 0; i < MAP_SIZE; i++) {

            for (var j = 0; j < MAP_SIZE; j++) {

                var str = "#" + i+"-" + j;

                if(player.map[i][j]==SQUARE_STATE.HIT){
                    $(str).children().attr("src", player.giveCandySource());
                    $(str).children().show();
                }
                else if(player.map[i][j]==SQUARE_STATE.MISS){
                    $(str).children().hide();
                }
                else{
                    $(str).children().attr("src", JAM_SOURCE);
                    $(str).children().show();
                }
                
            }
        }      
    }

    showPossibleStash(coordenate, player){

        var coordenates = coordenate.split("-");
        var x = coordenates[1];
        var y = coordenates[0];

        var stash = player.giveCurrentStashToPlace();


        if(stash.direction== STASH_DIRECTIONS.HORIZONTAL && player.canPlaceStashHorizontal(x,y,stash)){

            var startX = Math.round(x-(stash.size/2));

            for(var i=0; i<stash.size;i++){    

                var str = "#" + y+"-" + (startX+i);
                $(str).children().attr("src", player.giveCandySource());
                $(str).children().show();
            }
        }
        else if(stash.direction== STASH_DIRECTIONS.VERTICAL && player.canPlaceStashVertical(x,y,stash)){
 
            var startY = Math.round(y-(stash.size/2));

            for(var i=0; i<stash.size;i++){
                    
                var str = "#" +(startY+i) +"-" + x;
                $(str).children().attr("src", player.giveCandySource());
                $(str).children().show();
            }

        }
    }

}
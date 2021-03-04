/**Copyright (c) 2020, Daniela Marino*/

'use strict';
import {MAX_TURNS} from './Constants.js'

//this class manages all the front end of the side bar
export default class Sidebar{

    constructor(){

    }

    showStashToPlace(stash){

        $("#place-candy").show();
        $("#stats").hide();

        $("#stash-size").html(stash.size);
        $("#stash-name").html(stash.name);
        $("#stash-go-back").show();
        $("#stash-go-next").show();
        $("#place-random").css("display", "block");
        $("#ready").hide();
    }

    allPlaced(){

        $("#ready").css("display", "block");
        $("#place-random").hide();

        $("#stash-size").html("");
        $("#stash-name").html("All placed");
        $("#stash-go-back").hide();
        $("#stash-go-next").hide();
    }

    showScore(players, playerTurn){
    

        $("#player-turn").html(players[playerTurn].name + " score: " + players[playerTurn].score);
        $("#player-turns").html(" Turns Left: " + (MAX_TURNS - players[playerTurn].movements));
        for(var i=0; i < players[playerTurn].stash.length;i++){

            //score of current player
            var nameTurn = "#p"+(playerTurn+1)+ "-stash" +i;

            

            if(players[playerTurn].stash[i].sunk){
                $(nameTurn).css("opacity", "0.3");
            }
            else{
                $(nameTurn).css("opacity", "1");
            }

            //score of opposite
            var oppositte = Math.abs(playerTurn-1);
            var nameOpposite =  "#p"+(oppositte+1)+ "-stash" +i;

            if(players[oppositte].stash[i].sunk){
                $(nameOpposite).css("opacity", "0.3");
            }
            else{
                $(nameOpposite).css("opacity", "1");
            }
        }

        $("#place-candy").hide();
        $("#stats").show();

    }
}
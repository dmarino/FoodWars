/**Copyright (c) 2020, Daniela Marino*/

'use strict';

import {JAM_SOURCE,STASH_TYPES} from './Constants.js'
export default class Modal{

    constructor(){
    }

    showSelectCandy(mGameType){

        $(".player2-name").html(mGameType);
        $("#modal-wrapper").show();

    }
    
    changeCandy(player){
        if(player.name=="Player 1"){
            $("#player1-candy-image").attr("src", player.giveCandySource());
        }
        else{
            $("#player2-candy-image").attr("src", player.giveCandySource());
        }
    }


    showHit(source){

        $("#message").html("It was a Hit!");
        $("#modal-img").attr("src", source);
        $("#candy-choise").hide();
        $("#score-modal").hide();
        $("#sub-message").html("");
        $("#message-modal").show();
        $("#modal-wrapper").show();
    }

    showSunk(result,source){

        $("#message").html("You got all the stash!!");
        $("#modal-img").attr("src", source);
        $("#candy-choise").hide();
        $("#score-modal").hide();
        $("#sub-message").html("enjoy your " + STASH_TYPES[result].name);
        $("#message-modal").show();
        $("#modal-wrapper").show();
    }

    showMissModal(){
        $("#message").html("It Was A Miss!");
        $("#modal-img").attr("src", JAM_SOURCE);
        $("#sub-message").html("now you just have jam");
        $("#candy-choise").hide();
        $("#score-modal").hide();
        $("#message-modal").show();
        $("#modal-wrapper").show();
    }

    showEndModal(message, players){
        $("#score-message").html(message);

        $("#p1-score-modal").html("Score " +players[0].score);
        $("#p2-score-modal").html("Score " +players[1].score);


        $("#candy-choise").hide();
        $("#message-modal").hide();
        $("#score-modal").show();
        $("#modal-wrapper").show();
        
    }

    showWrongModal(){
        $("#message").html("You already hit that place");
        $("#modal-img").attr("src", JAM_SOURCE);
        $("#sub-message").html("That was a wrong move! pay more attention!");
        $("#candy-choise").hide();
        $("#score-modal").hide();
        $("#message-modal").show();
        $("#modal-wrapper").show();
        
    }   

}
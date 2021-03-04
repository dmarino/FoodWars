/**Copyright (c) 2020, Daniela Marino*/

'use strict';

import {MAP_SIZE, GAME_TYPE, GAME_PHASES,STASH_DIRECTIONS, JAM_SOURCE, SQUARE_STATE, MAX_TURNS} from './Constants.js'
import Map from './Map.js'
import Modal from './Modal.js'
import Sidebar from './Sidebar.js'
import Player from './Player.js';
import Sound from './Sound.js';

//this is the class that handles the game
class Game{

    //constructor of the class
    constructor(){

        //create other modules that help keep the code clean
        this.map = new Map();
        this.modal = new Modal();
        this.sidebar = new Sidebar();
        this.sound = new Sound();

        //create variables that help through all the game
        this.gameType=GAME_TYPE.COMP;
        this.gamePhase=GAME_PHASES.START;
        this.playerTurn =0;

        //creates the players in an array, this saves me so much code because it makes it easier to change player
        this.players=[2];
        this.players[0]=new Player("Player 1");
        this.players[1]=new Player("player 2");


        //this are attributes that will help only with the placement of the ships
        this.lastCoordenate="";
        this.currentDirectionOfStash= STASH_DIRECTIONS.HORIZONTAL;

    }

    //this happens when a game is beggining
    //it changes the type of game and shows the modal to select candy
    selectCandy(mGameType){

        if(mGameType==GAME_TYPE.COMP){
            this.players[1].name = "Computer";
            this.sound.playPlayerOneStart();
        }else{
            this.sound.playTwoPlayerStart();
        }
        this.gameType = mGameType;
        this.modal.showSelectCandy(this.gameType);
    }
    //method that helps with the change of candy of a player
    changeCandyPlayer(player, direction){

        this.players[player].changeCandy(direction);
        this.modal.changeCandy(this.players[player]);
        this.sound.playChangeCandySound();

    }

    //changes the state of the game to place the stash
    showPlaceStash(){

        this.sound.playStart();
        this.gamePhase = GAME_PHASES.PLACER;

        //changes all the pictures with the candy selected
        $(".p-stash").attr("src", this.players[0].giveCandySource());
        $(".p1-stash").attr("src", this.players[0].giveCandySource());
        $(".p2-stash").attr("src", this.players[1].giveCandySource());

        //hides modal and enters game
        $("#modal-wrapper").hide();
        $("#inicio").hide();
        $("#game").show();

        //updates sidebar
        this.sidebar.showStashToPlace(this.players[0].giveCurrentStashToPlace());
    }

    //shows in the board the possible placement of the current stash
    //it changes the direction of the stash according to the value currentDirection of ths class
    showPossibleStash(coordenate){

        this.lastCoordenate= coordenate;

        if(this.players[this.playerTurn].checkIfAllPlaced()==false){
            this.players[this.playerTurn].changeDirectionOfCurrentStash(this.currentDirectionOfStash);
            this.map.showPossibleStash(coordenate,this.players[this.playerTurn]);
        }

    }

    //shows the map of the player with the current placements
    resetPossibleStash(){
        this.map.showMapStash(this.players[this.playerTurn]);
    }

    //it gets called with the arrow heys and changes the direction of the stash
    changeDirectionOfStash(){

        //stops chowing the old possible position
        this.resetPossibleStash();

        //changes the direction temp
        if(this.currentDirectionOfStash==STASH_DIRECTIONS.HORIZONTAL){
            this.currentDirectionOfStash=STASH_DIRECTIONS.VERTICAL;
        }
        else{
            this.currentDirectionOfStash=STASH_DIRECTIONS.HORIZONTAL;
        }

        //shows new direction
        this.showPossibleStash(this.lastCoordenate);
    }

    //tries th place the stash in the player's map acoording to the coordenate
    //then shows the new map
    placeStash(coordenate){

        var coordenates = coordenate.split("-");
        var x = coordenates[1];
        var y = coordenates[0];

        this.players[this.playerTurn].placeStash(x,y);
        this.map.showMapStash(this.players[this.playerTurn]);

        this.changeStashToPlace(1);
    }

    //changes the stash that is displayed to place
    //here it also changes the sidebar if all stashes are placed
    changeStashToPlace(direction){

        this.sound.playChangeStashSound();

        if(this.players[this.playerTurn].checkIfAllPlaced()==true){
            this.sidebar.allPlaced();
        }
        else{
            this.players[this.playerTurn].changeStashToPlace(direction);
            this.sidebar.showStashToPlace(this.players[this.playerTurn].giveCurrentStashToPlace());
        }

    }

    //calls the method that places the stash randomly in the current players map
    //then shows the new map and shows the all placed sidebar
    placeRandom(){

        this.players[this.playerTurn].placeStashRandom();
        this.map.showMapStash(this.players[this.playerTurn]);

        this.resetPossibleStash();
        this.sidebar.allPlaced();
    }

    //waits 2 seconds to choose a random place in the map to hit
    //if the place has already been hit finds another
    hitRandom(){

        setTimeout(() => {

            var hit = false;
            var oppositte = Math.abs(this.playerTurn-1);
            while(hit==false){

                var x= Math.round(Math.random() * (MAP_SIZE-1));
                var y= Math.round(Math.random() * (MAP_SIZE-1));

                if(this.players[oppositte].giveStateOfSquare(x,y)!=SQUARE_STATE.HIT &&this.players[oppositte].giveStateOfSquare(x,y)!=SQUARE_STATE.MISS){
                    var coordenate = y +"-" +x;
                    this.hitMap(coordenate);
                    hit=true;
                }

            }

        }, 2000);


    }


    //when the player clicks ready in the placement of the stash
    stashReady(){
        if(this.playerTurn==0){
            if (this.gameType == GAME_TYPE.COMP){
                this.startGame();
            }
            else{
                this.lastCoordenate="";
                this.currentDirectionOfStash= STASH_DIRECTIONS.HORIZONTAL;
                this.changeTurnOfPlayer();
                this.resetPossibleStash();
                this.sidebar.showStashToPlace(this.players[this.playerTurn].stash[0]);
            }
        }
        else{
            this.startGame();
        }
    }


    //starts the game
    startGame(){

        if(this.gameType==GAME_TYPE.COMP){
            this.players[1].placeStashRandom();

            $("#game").hide();
            $("#change-screen").show();

            setTimeout(() => {

                this.sidebar.showScore(this.players, this.playerTurn);
                $(".slot").children().attr("src", JAM_SOURCE).show();
                $("#change-screen").hide();
                $("#game").show();

            }, 1500);
        }
        else{
            this.changeTurnOfPlayer();
        }

        this.gamePhase = GAME_PHASES.PLAYING;
        this.sound.playBackgroundMusic();
    }

    //changes the turn of the player and shows the change screen
    changeTurnOfPlayer(){

        //this gives me 1 if is 0, o if is 1
        var last = this.playerTurn;
        this.playerTurn = Math.abs(this.playerTurn-1);

        $(".p-stash").attr("src", this.players[this.playerTurn].giveCandySource());

        var name = this.players[this.playerTurn].name + "'s move";
        $("#change-player-name").html(name);

        $("#game").hide();
        $("#change-stage").hide();
        $("#change-player").show();
        $("#change-screen").show();

        this.sidebar.showScore(this.players, this.playerTurn);
        this.map.showMapGame(this.players[last]);

        setTimeout(() => {
            $("#change-screen").hide();
            $("#game").show();

            if(this.gameType==GAME_TYPE.COMP && this.playerTurn==1 &&this.gamePhase== GAME_PHASES.PLAYING){
                this.hitRandom();
            }

        }, 1500);

    }

    //hits the map of the oppositte player
    hitMap(coordenate){

        var coordenates = coordenate.split("-");
        var x = coordenates[1];
        var y = coordenates[0];

        var oppositte = Math.abs(this.playerTurn-1);

        var result = this.players[oppositte].hit(x,y);

        if(result!=SQUARE_STATE.MISS && result!=undefined){
            this.players[this.playerTurn].changeScore();
            if(this.players[oppositte].checkIfSunken(result)){
                this.modal.showSunk(result, this.players[oppositte].giveCandySource());
                this.sound.playGotStash();
            }
            else{
                this.modal.showHit(this.players[oppositte].giveCandySource());
                this.sound.playHitStash();
            }
        }
        else if(result!=undefined){
            this.modal.showMissModal();
            this.sound.playMissStash();
        }
        else{
            this.modal.showWrongModal();
        }



        this.players[this.playerTurn].addMovement();
        this.map.showMapGame(this.players[oppositte]);

        setTimeout(() => {
            $("#modal-wrapper").hide();
            this.checkEndTurn();
        }, 2000);
    }

    //check if the current player ate all the stash of the opossite player
    //shows the message if its true
    checkEndTurn(){

        var oppositte = Math.abs(this.playerTurn-1);

        if(this.players[oppositte].howManyLeft()==0){

            if(this.gameType == GAME_TYPE.COMP && this.playerTurn==1){
                this.gamePhase= GAME_PHASES.WON;
                this.modal.showEndModal("You Lost!",this.players);
                this.sound.playLoseSound();
            }
            else{
                this.gamePhase= GAME_PHASES.WON;
                this.modal.showEndModal("You Won!",this.players);
                this.sound.playWinSound();
            }
        }
        else if(this.players[this.playerTurn].movements==MAX_TURNS){
            this.gamePhase= GAME_PHASES.WON;
            this.modal.showEndModal("You Run Out Of Turns!",this.players);
            this.sound.playLoseSound();
        }
        else{
            this.changeTurnOfPlayer();
        }

    }

    //restarts the game and goes back to the place stash screen
    restartGame(){

        this.players[0].restart();
        this.players[1].restart();

        this.playerTurn=0;

        this.gamePhase = GAME_PHASES.PLACER;
        $("#modal-wrapper").hide();
        this.sidebar.showStashToPlace(this.players[0].giveCurrentStashToPlace());
        this.map.showMapStash(this.players[0]);
    }

}

//this creates instance of app
let game = new Game();

//here i manage navigation, i wanted to do it in another file but didn't knew how to call the methods there
/*
[SH] doing this inthe ready function is not much different than having a big mess of global functions,
do this in the App/Game controller constructor.

think... App controller manages the game UI, Game manages game state in your case, so...

class App {

    constructor() {
        this.game = new Game();

        // you can add the event, or not, putting it in there and not using it tells
        // you in the future that its available
        $("#1-player-btn").click( event => this.game.selectCandy( GAME_TYPE.COMP ));
        $("#2-player-btn").click( event => this.game.selectCandy( GAME_TYPE.P2 ));
        // etc...

        // using the fat arrows means we can use "this" refering to the App inside
        // methods that call them...
    }

    run() {}
}

$(document).ready( event => {
    let app = new App();
    app.run();
})

*/

$(document).ready(function(){

/*
[SH]  Now take all these loose functions and messy code and put it inside the App controller above.0
Put that app controller in a separate file and import it here. Neat, clean, done.
*/
    //when element 1-player-btn is clicked hide inicio and show game
    $("#1-player-btn").click(function(){
        game.selectCandy(GAME_TYPE.COMP);
     });

    //when element 2-player-btn is clicked hide inicio and show for now the change of player screen
    $("#2-player-btn").click(function(){
        game.selectCandy(GAME_TYPE.P2);
    });

    //changing the type of candy
    $("#p1-go-back").click(function(){
        game.changeCandyPlayer(0,-1);
    });

    //changing the type of candy
    $("#p1-go-next").click(function(){
        game.changeCandyPlayer(0,1);
    });

    //changing the type of candy
    $("#p2-go-back").click(function(){
        game.changeCandyPlayer(1,-1);
    });

    //changing the type of candy
    $("#p2-go-next").click(function(){
        game.changeCandyPlayer(1,1);
    });

    //when the types of candy are ready
    $("#start").click(function(){
        game.showPlaceStash();
    });

    //listens to the arrow keys in the placement of the ships
    $(document).keydown(function(e) {
        if(game.gamePhase== GAME_PHASES.PLACER){
            switch(e.which) {
                case 37: // left
                case 38: // up
                case 39: // right
                case 40: // down
                game.changeDirectionOfStash();
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        }
    });

    //hovering on the map
    $(".slot").hover(
        function(){
            //do when is in
            if(game.gamePhase== GAME_PHASES.PLACER){
                var str = $(this).attr("id");
                game.showPossibleStash(str);
            }
        },

        function(){
            //do when is out
            if(game.gamePhase== GAME_PHASES.PLACER){
                game.resetPossibleStash();
            }
        }
    );

    //when some element of the table is click
    $(".slot").click(function(){
        if(game.gamePhase== GAME_PHASES.PLACER){
            var str = $(this).attr("id");
            game.placeStash(str);
        }
        else if(game.gamePhase==GAME_PHASES.PLAYING ){

            //i was accidentaly creating a bug here when the player try to hit in the computer's turn so i put an if to prevent that
            if(!(game.gameType==GAME_TYPE.COMP && game.playerTurn==1)){
                var str = $(this).attr("id");
                game.hitMap(str);
            }

        }
    });

    //changing stash to place
    $("#stash-go-back").click(function(){
        game.changeStashToPlace(-1);
    });

    //changing stash to place
    $("#stash-go-next").click(function(){
        game.changeStashToPlace(1);
    });

    //place randomly the stash
    $("#place-random").click(function(){
        game.placeRandom();
    });

    //finish placing the stash
    $("#ready").click(function(){
        game.stashReady();
    });

    //finish placing the stash
    $(".quit").click(function(){
        location.reload(true);
    });

    //finish placing the stash
    $(".restart").click(function(){
        game.restartGame();
    });

    //toogles the sound
    $("#sound").click(function(){
        game.sound.changeBackgroundMusic();
    });

});

/**Copyright (c) 2020, Daniela Marino*/

'use strict';

import {SQUARE_STATE, MAP_SIZE,CANDY_TYPES, STASH_TYPES, STASH_DIRECTIONS} from './Constants.js'

//this class represents all the logic in the player, this makes the code cleaner that what i had before
export default class Player{

    constructor(mName){

        this.name=mName;
        this.playerCandy=0;
        this.score=0;
        this.movements=0;
        this.stash=[];
        this.map=[];

        //auto generate some info of the players cause it's easier
        this.generateMatrix();
        this.generateStash();


        this.currentStashToPlace=0;
    }


    //creates the default matrix of the player
    //this is the best way i found to do this
    generateMatrix(){       
        
        //create the 1 dimension arrays
        this.map = new Array(MAP_SIZE);

        // Loop to create the second dimmension
        for (var i = 0; i < MAP_SIZE; i++) { 
            this.map[i] = new Array(MAP_SIZE); 
        } 

        // Loop to initilize all squares in water
        for (var i = 0; i < MAP_SIZE; i++) { 
            for (var j = 0; j < MAP_SIZE; j++) { 
                this.map[i][j] = SQUARE_STATE.WATER;
            } 
        } 
    }

    //generates all the stash of each player with positions in -1 so it won't show at the beggining
    generateStash(){

        //i create the stash of every player according to the stash type constant
        for(var i=0; i <STASH_TYPES.length; i++){

            this.stash[i] = {
                name: STASH_TYPES[i].name,
                size: STASH_TYPES[i].size,
                direction: STASH_DIRECTIONS.HORIZONTAL,
                placed: false,
                sunk:false,
                slots:[]
            }

            //initialize the array of slots
            this.slots = new Array(STASH_TYPES[i].size);

            //i create all the slots of each stash with positions out of the matrix so it wont show at beggining
            for(var j=0; j< STASH_TYPES[i].size; j++){
                this.slots[j] ={
                    x: -1,
                    y: -1,
                    hit: false
                }
            }
        }
    }

    //changes the drawing of the candy between the candy types that i'v got
    //this is a loop chooser i guess
    changeCandy(direction){
        if(this.playerCandy+direction <0){
            this.playerCandy = CANDY_TYPES.length -1;
        }
        else if(this.playerCandy+direction >= CANDY_TYPES.length){
            this.playerCandy=0;
        }
        else{
            this.playerCandy = this.playerCandy+direction;
        }
    }

    //returns the source of the asset of the candy type
    giveCandySource(){
        return CANDY_TYPES[this.playerCandy].source;
    }

    //returns the object stash that is currently being placed
    giveCurrentStashToPlace(){
        return this.stash[this.currentStashToPlace];
    }

    //changes the direction of the stash thats going to be placed
    changeDirectionOfCurrentStash(direction){
        this.stash[this.currentStashToPlace].direction = direction;
    }


    //returns true if you can place the stash horizontally in the map of the player
    //the x and y coordenates are of the middle of the boat
    canPlaceStashHorizontal(x,y,stash){

        var startX = Math.round(x-(stash.size/2));

        //check if its in bounds
        if(startX>=0 && startX+stash.size<= MAP_SIZE){

            //check that doesn't collide with anything
            for(var i=0; i<stash.size;i++){

                if(this.map[y][startX+i] != SQUARE_STATE.WATER){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    //returns true if you can place the stash vertically in the map of the player
    //the x and y coordenates are of the middle of the boat
    canPlaceStashVertical(x,y,stash){

        var startY = Math.round(y-(stash.size/2));

        //check if its in bounds
        if(startY>=0 && startY+stash.size<= MAP_SIZE){

            //check that doesn't collide with anything
            for(var i=0; i<stash.size;i++){
                
                if(this.map[startY+i][x] != SQUARE_STATE.WATER){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    //place the current stash of the player in the grid according to the direction and if it can be placed
    placeStash(x,y){

        var stash = this.stash[this.currentStashToPlace];

        if(stash.direction== STASH_DIRECTIONS.HORIZONTAL && this.canPlaceStashHorizontal(x,y,stash)){

            var startX = Math.round(x-(stash.size/2));

            for(var i=0; i<stash.size;i++){    

                this.stash[this.currentStashToPlace].slots[i] = { x: startX+i, y: y, hit: false};
                this.map[y][startX+i] = this.currentStashToPlace;
            }

            this.stash[this.currentStashToPlace].placed=true;
        }

        else if(stash.direction== STASH_DIRECTIONS.VERTICAL && this.canPlaceStashVertical(x,y,stash)){
 
            var startY = Math.round(y-(stash.size/2));

            for(var i=0; i<stash.size;i++){  

                this.stash[this.currentStashToPlace].slots[i] = { x: x, y: startY+i, hit: false};
                this.map[startY+i][x] = this.currentStashToPlace;
            }

            this.stash[this.currentStashToPlace].placed=true;

        }
        else{

            if(this.map[y][x] != SQUARE_STATE.WATER){
                this.unPlaceStash(this.map[y][x]);
            }
        }
    }

    //removes the stash from the grid
    unPlaceStash(stashNumber){

        for(var i=0; i < this.stash[stashNumber].size; i++){

            var slot =this.stash[stashNumber].slots[i];

            this.map[slot.y][slot.x] = SQUARE_STATE.WATER;
            this.stash[stashNumber].slots[i]= { x: -1, y: -1,hit: false};
        }

        this.stash[stashNumber].placed=false;
        this.currentstashToPlace = stashNumber;
    }

    //check if all the stash has been palced
    //returns false if there is some left, true when all have been placed
    checkIfAllPlaced(){

        for(var i=0; i<this.stash.length;i++){

            if(this.stash[i].placed==false){
                return false;
            }
        }
        return true;
    }

    //this method changes the stash that's going to be placed
    //please always call this after checking that not all stash have been placed
    changeStashToPlace(number){

        //change the number to fit the lenght of the stash
        if(this.currentStashToPlace+number<0){
            this.currentStashToPlace = STASH_TYPES.length-1;
        }
        else if(this.currentStashToPlace+number>=STASH_TYPES.length){
            this.currentStashToPlace =0;
        }
        else{
            this.currentStashToPlace+=number;
        }

        if(this.stash[this.currentStashToPlace].placed){
            this.changeStashToPlace(number);
        }
    }

    //places the rest of the stash randomly
    placeStashRandom(){
        
        var stashPlaced=0;

        //this loop continues until all the stash has been placed
        while(stashPlaced <this.stash.length){

            var stashToPlace = this.stash[stashPlaced];

            //if it hasnt been placed creates random direction, random x and y to place
            if(stashToPlace.placed==false){

                var x= Math.round(Math.random() * (MAP_SIZE-1));
                var y= Math.round(Math.random() * (MAP_SIZE-1));
                var direction = Math.round(Math.random());

                stashToPlace.direction = direction;

                //if it can be placed there it places them
                if(direction==STASH_DIRECTIONS.HORIZONTAL && this.canPlaceStashHorizontal(x,y,stashToPlace)){
                    this.currentStashToPlace = stashPlaced;
                    this.placeStash(x,y);
                    stashPlaced++;
                }
                else if(direction==STASH_DIRECTIONS.VERTICAL && this.canPlaceStashVertical(x,y,stashToPlace)){
                    this.currentStashToPlace = stashPlaced;
                    this.placeStash(x,y);
                    stashPlaced++;
                }
            }
            else{
                //if it had already been placed continues to the next one
                stashPlaced++;
            }
        }
    }

    //the map gets hit 
    hit(x,y){

        //if there was only water the player missed
        if(this.map[y][x]==SQUARE_STATE.WATER){

            this.map[y][x]=SQUARE_STATE.MISS;
            return SQUARE_STATE.MISS;
        }

        //if it wasn't on a miss or an already hit one then the player scores!
        else if (this.map[y][x]!=SQUARE_STATE.HIT && this.map[y][x]!=SQUARE_STATE.MISS){

            var stashNumber = this.map[y][x];

            for(var i=0; i<this.stash[stashNumber].size;i++){

                if(this.stash[stashNumber].slots[i].x==x &&this.stash[stashNumber].slots[i].y==y){
                    this.stash[stashNumber].slots[i].hit=true;
                }
            }

            //changes the square state to hit
            this.map[y][x]=SQUARE_STATE.HIT;
            return stashNumber;
        }
    }


    //checks if the stash given by number has been eaten (sunken)
    checkIfSunken(stashNumber){

        for(var i=0; i<this.stash[stashNumber].size;i++){
            if(this.stash[stashNumber].slots[i].hit!=true){
                return false;
            }
        }
        this.stash[stashNumber].sunk=true;
        return true;
    }

    //returns the number of the stash left
    howManyLeft(){

        var amount =this.stash.length;

        for(var i = 0; i < this.stash.length; i++){

            if(this.stash[i].sunk==true){
                amount--;
            }
        }
        return amount;

    }
    
    //the score of the player goes up
    changeScore(){
        this.score+=200;
    }

    //gives the number in the x and y coordenate
    giveStateOfSquare(x,y){
        return this.map[y][x];
    }

    //adds the movement by one
    addMovement(){
        this.movements++;
    }

    restart(){
        this.generateMatrix();
        this.generateStash();

        this.score=0;
        this.movements=0;
        this.currentStashToPlace=0;
    }
}
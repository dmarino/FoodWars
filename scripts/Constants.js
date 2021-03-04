//this is the fixed information of the game, this should be in a json but i don't remember how to do that

//the type of game it can be played
export const GAME_TYPE = {
    COMP: "Computer",
    P2: "Player 2",
}

//the type of game it can be played
export const GAME_PHASES = {
    START: 1,
    PLACER: 2,
    PLAYING:3,
    WON:4
}

//the type of candy the player can choose to represent it's hidden stash
//this has the path of the image and an index
export const CANDY_TYPES = [
    {name: "Candy", source: "images/candy.png"},
    {name:"Chocolate", source: "images/chocolate.png"},
    {name:"Soda", source: "images/soda.png"}
]

//the types of stash with their size, the size was in the brief of the assigment
export const STASH_TYPES=[
    {name:"Really big stash", size:5},
    {name:"Big stash", size:4},
    {name:"Normal stash", size:4},
    {name:"Small stash", size:3},
    {name:"Really small stash", size:2}
]

//if the stash is placed vertically or horizontally
export const STASH_DIRECTIONS={
    HORIZONTAL: 0,
    VERTICAL: 1,
}

//the size of the map in case you want to make it bigger
export const MAP_SIZE =10;

//the size of the map in case you want to make it bigger
export const MAX_TURNS =100;

//the state of a square of the grid
//they are negatives so i can put the number of the stash positives in the grid as well
export const SQUARE_STATE = {
    WATER: -1,
    HIT: -2,
    MISS: -3
}

//the source of the jam asset
export const JAM_SOURCE = "images/jam.png";
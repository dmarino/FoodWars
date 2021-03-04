/**Copyright (c) 2020, Daniela Marino*/

'use strict';

//this class manages all the sounds of the game.... it just do that nothing more interesting
export default class Sound{

    constructor(){

        this.backgroundMusic = new buzz.sound("sound/Raga_Dance_of_Music.mp3");

        this.onePlayerStart= new buzz.sound("sound/mario-letsgo.WAV");
        this.twoPlayerStart= new buzz.sound("sound/mario-okiedokie.WAV");
        this.startSound= new buzz.sound("sound/Super Mario 64 Key Get Sound Effect.wav");

        this.changeCandySound= new buzz.sound("sound/Crash-bandicoot-life.wav");
        this.changeStashSound= new buzz.sound("sound/Mario Coin.wav");

        this.hitSound = new buzz.sound("sound/Hair_Ripping.mp3");
        this.missSound = new buzz.sound("sound/Super Mario Bros Bump Sound Effect.wav");
        this.gotAllStashSound = new buzz.sound("sound/Super Mario 64 Star Catch Fanfare Sound Effect.mp3");

        this.winSound = new buzz.sound("sound/Spirit Orb Sound Effect The Legend Of Zelda Breath Of The Wild.mp3");
        this.loseSound = new buzz.sound("sound/Super Mario Bros Die.wav");
        
    }

    playBackgroundMusic(){
        this.backgroundMusic.setVolume(50);
        this.backgroundMusic.loop().play().fadeIn();
    }

    changeBackgroundMusic(){
        this.backgroundMusic.toggleMute();
    }

    playPlayerOneStart(){
        this.onePlayerStart.play();
    }

    playTwoPlayerStart(){
        this.onePlayerStart.play();
    }

    playStart(){
        this.startSound.play();
    }

    playChangeCandySound(){
        this.changeCandySound.stop();
        this.changeCandySound.play();
    }

    playChangeStashSound(){
        this.changeStashSound.stop();
        this.changeStashSound.play();
    }

    playHitStash(){
        this.hitSound.play();
    }

    playMissStash(){
        this.missSound.play();
    }

    playGotStash(){
        this.gotAllStashSound.play();
    }

    playWinSound(){
        this.winSound.play();
    }

    playLoseSound(){
        this.loseSound.play();
    }
}
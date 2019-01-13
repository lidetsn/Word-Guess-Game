
var alphabetArray = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');// array of alphabet, i used it to controle user input
var wordArray = ["HOUSE", "MARRY", "LETTER", "MOTHER", "MARKET", "AUTUMN", "BOOK", "2PAC"];// array of words for gussing
var gameFeedbackContainer = "";

// game object
var game = {
    gameState: {},// an empty game state object which can be created when the game started
    hasGameStarted: false,
    feedback: "",
    //game methods
    resetGameState: function () {
        game.gameState.randomChosenWord = game.generateRandomWord(wordArray);//invoke random word generator function
        game.gameState.attemptRemaining = 10;
        game.gameState.guessedLetters = [];
        game.updateGame();
    },
    provideGameFeedback: function (status, data) {
        gameFeedbackContainer = document.getElementById("game-feedback");

        switch (status) {
            case "win":
                game.feedback = "You have successfully guessed the word: " + game.gameState.randomChosenWord + "<br><img src='assets/images/giphy.gif'>";
                gameFeedbackContainer.innerHTML = game.feedback;
                setTimeout(game.resetFeedBack, 15000)
                break;
            case "loss":
                game.feedback = "You failed to correctly guess the word: " + game.gameState.randomChosenWord + "<br><img src='assets/images/goodluck.gif'>";
                gameFeedbackContainer.innerHTML = game.feedback;
                setTimeout(game.resetFeedBack, 15000)
                break;
            case "duplicate":
                if (data) {
                    game.feedback = "You have already guessed the letter: " + data;
                    gameFeedbackContainer.innerHTML = game.feedback;
                    setTimeout(game.resetFeedBack, 7000)
                    break;
                }
            case "general":
                game.feedback = data;
                if (data == "Good Luck !!") {
                    gameFeedbackContainer.innerHTML = game.feedback + "<br><img src='assets/images/goodluck.gif'></img>";
                }

                else { gameFeedbackContainer.innerHTML = game.feedback; }
                setTimeout(game.resetFeedBack, 7000)
                break;


        }

        //    gameFeedbackContainer.innerHTML = game.feedback;
        //    setTimeout(game.resetFeedBack, 12000) 
    },

    resetFeedBack: function () {
        gameFeedbackContainer = document.getElementById("game-feedback");
        gameFeedbackContainer.innerHTML = "keep trying";
    },
    generateRandomWord: function (wordArray) {
        var index = Math.floor(Math.random() * wordArray.length);
        return wordArray[index];
    },
    updateGame: function (guessedLetter) {
        var wins = document.getElementById("wins");
        var losses = document.getElementById("losses");
        var attemptRemaining = document.getElementById("attempt-remaining");
        var wordNameDisplayContainer = document.getElementById("random-word-name");
        var wronglyGuessedLettersContainer = document.getElementById("letters-guessed");
        var randomWordCharacterArray = game.gameState.randomChosenWord.split("");//create an array of the characters in the word
        var placeHolderCharactersToDisplay = "";
        var wronglyGuessedLettersToDisplay = "";

        //if no gussed letter yet, 
        if (!guessedLetter) {
            wins.innerHTML = game.gameState.wins;
            losses.innerHTML = game.gameState.losses;
            attemptRemaining.innerHTML = game.gameState.attemptRemaining;

            randomWordCharacterArray.forEach(function(character) {
                if (alphabetArray.indexOf(character) <= -1) {// in case the random word contains non alphabetic leter eg 2pac
                    placeHolderCharactersToDisplay += character;
                }
                else { //placeholder character * 
                    placeHolderCharactersToDisplay += "___ . ";

                }
            });

        }
        else {//if there is gussed letter

            if (randomWordCharacterArray.indexOf(guessedLetter) <= -1 && game.gameState.guessedLetters.indexOf(guessedLetter) <= -1) {
                //when the gussedLetter is not in the randomword letter
                //gussedLetter is not gussed yet/ not in the array of gameState.guessedLetters
                // reduce attemptremaining by one and push the gussed letter into gameState.guessedLetters array
                //N.B only wrong attempt reduces the total attemt remaining
                game.gameState.attemptRemaining--;
                game.gameState.guessedLetters.push(guessedLetter);

            }
            else if (randomWordCharacterArray.indexOf(guessedLetter) > -1 && game.gameState.guessedLetters.indexOf(guessedLetter) <= -1) {
                //when the gussed letter is in the random word letter and is not gussed yet
                //push the gussed letter into gameState.guessedLetters array
                game.gameState.guessedLetters.push(guessedLetter);

            }
            else if (game.gameState.guessedLetters.indexOf(guessedLetter) > -1) {
                //if the gussed letter is already gussed , notify the player it has alrady gussed  

                game.provideGameFeedback("duplicate", guessedLetter);
            }

            //............................................................................................................................
            // construct the the gussed letter to display with correctly guessed
            // letters, non-alphabetic characters and "*" for letters yet
            // to be guessed
            randomWordCharacterArray.forEach(function (character) {
                // if the character in the gussed word is not an
                // alphabet or has been guessed, display it
                if (alphabetArray.indexOf(character) <= -1 || game.gameState.guessedLetters.indexOf(character) > -1) {
                    placeHolderCharactersToDisplay += character;
                }
                else {
                    placeHolderCharactersToDisplay += "___ . ";
                }
            })

            // construct the wronly guessed letters to display that are not
            // part of the random word letters
            game.gameState.guessedLetters.forEach(function (letter) {
                if (randomWordCharacterArray.indexOf(letter) <= -1) {
                    wronglyGuessedLettersToDisplay += letter + " ";
                }
            });
        } //end else
        // update the div containing the wrongly guessed letters
        wronglyGuessedLettersContainer.innerHTML = wronglyGuessedLettersToDisplay;

        // update the div containing the correctly guessed letters in the
        // movie name
        wordNameDisplayContainer.innerHTML = placeHolderCharactersToDisplay;

        // check if all the letters have been guessed without running
        // out of the guess limit and the game is won
        // OR
        // the player is out of guesses and the game is lost
        if (placeHolderCharactersToDisplay.indexOf("___ . ") <= -1 && game.gameState.attemptRemaining >= 1) {
            game.gameState.wins++;
            game.provideGameFeedback("win");
            setTimeout(setNewGame, 5000);

        }
        else if (placeHolderCharactersToDisplay.indexOf("___ . ") > -1 && game.gameState.attemptRemaining <= 0) {
            game.gameState.losses++;
            game.provideGameFeedback("loss");
            // playSet();
            setTimeout(setNewGame, 5000);
        }

        wins.innerHTML = game.gameState.wins;
        losses.innerHTML = game.gameState.losses;
        attemptRemaining.innerHTML = game.gameState.attemptRemaining;
    }// end of update method

}//end of game object
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//jquery code to launch the js 
/* $(document).ready(function () {  

  startPlay();
   });*/
//****************************************************** */ 

//js code to launch the js 
document.addEventListener("DOMContentLoaded", function (event) {

    setVisbility("visibility:hidden");
    startPlay(); //do work
});
//******************************************************** */

function startPlay() {
    document.onkeyup = function (event) {

        if (!game.hasGameStarted && event.code === "Space") { //when the game has not started the user expected to hit space bar to start the game


            // setTimeout(makeVisble, 3000)
            setVisbility("visibility:visible");
            var startingInstructionsStyle = "display:none";
            var startingInstructions = document.getElementById("starting-instructions");
            startingInstructions.style = startingInstructionsStyle;

            game.hasGameStarted = true;
            game.gameState = {
                "wins": 0,
                "attemptRemaining": 10,
                "losses": 0,
                "guessedLetters": [],
                "randomChosenWord": game.generateRandomWord(wordArray)
            };

            game.updateGame();
            game.provideGameFeedback("general", "Good Luck !!");
            playGame();

        }
        else {
            alert("please presse the space bar to start the word gussing !");
        }
    }//end of key event function
}//end of startplay function
//****************************************************************************************************************** */

function setNewGame() {
    console.log("New Game Started!");
    game.resetGameState();
    playGame();
}

function playGame() {
    document.onkeyup = function (event) {
        if (game.hasGameStarted) {
            //check the pressed key is a letter
            if (event.code !== "Space" && alphabetArray.indexOf(event.key.toUpperCase()) > -1) {
                game.provideGameFeedback("general", "keep guessing");
                game.updateGame(event.key.toUpperCase());
            } else {
                game.provideGameFeedback("general", "Invalid input /enter letters from the English alphabet");
            }
        }
    };
}


function Quit() {
    var answer = confirm("are you sure you want to Quit? you will lose all of your win points")
    if (answer) {
        window.location.reload();
    }
}
function setVisbility(vis) {
    document.getElementById("gameinfocontainer").style = vis;
    document.getElementById("gameinfocontainer2").style = vis;
    document.getElementById("close-btn").style = vis;

}


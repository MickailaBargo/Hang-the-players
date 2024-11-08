/* Players */
let players = [
    "Thibaut Courtois", "Andriy Lunin", "Dani Carvajal", "Eder Militao", "Antonio Rudiger",
    "David Alaba", "Jesus Vallejo", "Ferland Mendy", "Fran García", "Jude Bellingham",
    "Eduardo Camavinga", "Federico Valverde", "Luka Modric", "Aurélien Tchouaméni",
    "Arda Guler", "Lucas Vázquez", "Dani Ceballos", "Brahim Díaz", "Vinicius Junior",
    "Kylian Mbappé", "Rodrygo", "Endrick"
];

/* Game Constants */
const youWon = "You Won!";
const youLost = "You Lost!";

function Game() {
    let word = players[Math.floor(Math.random() * players.length)].toUpperCase();
    let guessedLetters = [];
    let maskedWord = "";
    let incorrectGuesses = 0;
    let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let won = false;
    let lost = false;
    const maxGuesses = 7;

    for (let i = 0; i < word.length; i++) {
        maskedWord += word.charAt(i) === " " ? " " : "_";
    }

    function guessWord(guessedWord) {
        guessedWord = guessedWord.toUpperCase();
        if (guessedWord === word) {
            guessAllLetters();
        } else {
            handleIncorrectGuess();
        }
    }

    function guessAllLetters() {
        for (let i = 0; i < word.length; i++) {
            guess(word.charAt(i));
        }
    }

    function guess(letter) {
        letter = letter.toUpperCase();
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            possibleGuesses = possibleGuesses.replace(letter, "");

            if (word.includes(letter)) {
                let matchingIndexes = [];
                for (let i = 0; i < word.length; i++) {
                    if (word.charAt(i) === letter) {
                        matchingIndexes.push(i);
                    }
                }

                matchingIndexes.forEach(index => {
                    maskedWord = replace(maskedWord, index, letter);
                });

                if (!lost) {
                    won = maskedWord === word;
                }
            } else {
                handleIncorrectGuess();
            }
        }
    }

    function handleIncorrectGuess() {
        incorrectGuesses++;
        lost = incorrectGuesses >= maxGuesses;
        if (lost) {
            guessAllLetters();
        }
    }

    return {
        getWord: () => word,
        getMaskedWord: () => maskedWord,
        guess,
        getPossibleGuesses: () => [...possibleGuesses],
        getIncorrectGuesses: () => incorrectGuesses,
        guessWord,
        isWon: () => won,
        isLost: () => lost
    };
}

function replace(value, index, replacement) {
    return value.substr(0, index) + replacement + value.substr(index + replacement.length);
}

function listenForInput(game) {
    function guessLetter(letter) {
        if (letter) {
            let gameStillGoing = !game.isWon() && !game.isLost();
            if (gameStillGoing) {
                game.guess(letter);
                render(game);
            }
        }
    }

    function handleClick(event) {
        if (event.target.classList.contains('guess')) {
            guessLetter(event.target.innerHTML);
        }
    }

    function handleKeyPress(event) {
        const A = 65, Z = 90, ENTER = 13;
        let letter = null;
        let isLetter = event.keyCode >= A && event.keyCode <= Z;
        let guessBox = document.getElementById("guessBox");
        let gameOver = guessBox.value === youWon || guessBox.value === youLost;

        if (event.target.id !== "guessBox" && isLetter) {
            letter = String.fromCharCode(event.keyCode);
        } else if (event.keyCode === ENTER && gameOver) {
            document.getElementById("newGameButton").click();
        } else if (event.keyCode === ENTER && guessBox.value !== "") {
            document.getElementById("guessWordButton").click();
        }
        guessLetter(letter);
    }

    document.addEventListener('keydown', handleKeyPress);
    document.body.addEventListener('click', handleClick);
}

function guessWord(game) {
    let gameStillGoing = !game.isWon() && !game.isLost();
    let guessedWord = document.getElementById('guessBox').value;
    if (gameStillGoing) {
        game.guessWord(guessedWord);
        render(game);
    }
}

function render(game) {
    document.getElementById("word").innerHTML = game.getMaskedWord();
    document.getElementById("guesses").innerHTML = "";
    game.getPossibleGuesses().forEach(guess => {
        document.getElementById("guesses").innerHTML += `<span class='guess'>${guess}</span>`;
    });
    document.getElementById("hangmanImage").src = "hangman" + game.getIncorrectGuesses() + ".png";

    let guessBox = document.getElementById('guessBox');
    if (game.isWon()) {
        guessBox.value = youWon;
        guessBox.classList = "win";
    } else if (game.isLost()) {
        guessBox.value = youLost;
        guessBox.classList = "loss";
    } else {
        guessBox.value = "";
        guessBox.classList = "";
    }
}

function newGame() {
    history.go(0);
}

let game = new Game();
render(game);
listenForInput(game);

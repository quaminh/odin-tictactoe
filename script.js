function GameBoard() {
    const size = 3;
    const board = [];

    const getBoard = () => board;

    const placeToken = (row, col, player) => {
        if (!board[row][col]) {
            board[row][col] = player;
            return true;
        }
        return false;
    };

    const checkWinCondition = () => {
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < size; ++i) {
            const boardRow = board[i];
            const boardCol = board.map((row) => row[i]);

            if (boardRow[0] !== 0 &&
                boardRow.every((val) => val === boardRow[0])) {
                    return boardRow[0];
            }
            if (boardCol[0] !== 0 &&
                boardCol.every((val) => val === boardCol[0])) {
                    return boardCol[0];
            }

            diagonal1.push(board[i][i]);
            diagonal2.push(board[i][size-1-i]);
        }

        if (diagonal1[0] !== 0 &&
            diagonal1.every((val) => val === diagonal1[0])) {
                return diagonal1[0];
        }
        if (diagonal2[0] !== 0 &&
            diagonal2.every((val) => val === diagonal2[0])) {
                return diagonal2[0];
        }

        for (let i = 0; i < size; ++i) {
            if (board[i].includes(0)) return 0;
        }

        return 3;
    };

    const clearBoard = () => {
        for (let i = 0; i < size; ++i) {
            board[i] = [];
            for (let j = 0; j < size; ++j) {
                board[i].push(0);
            }
        }
    }

    clearBoard();

    return { getBoard, placeToken, checkWinCondition, clearBoard };
}

function Player(name, token, symbol) {
    let score = 0;

    const getScore = () => score;
    const addScore = () => ++score;
    const resetScore = () => score = 0;

    return { name, token, symbol, getScore, addScore, resetScore };
}

function GameController(player1 = "Player 1", player2 = "Player 2") {
    const board = GameBoard();
    
    const players = [
        Player(player1, 1, "X"),
        Player(player2, 2, "O"),
        Player("Draws", 3, "")
    ];

    let activePlayer = players[0];
    let gameOver = false;
    let winCon = 0;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getPlayerOne = () => players[0];

    const getPlayerTwo = () => players[1];

    const getDraws = () => players[2];

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        console.log(`${activePlayer.name}'s Turn`);
        console.log(board.getBoard());
    };

    const playRound = (row, col) => {
        if (gameOver) return winCon;

        board.placeToken(row, col, activePlayer.token);
        winCon = board.checkWinCondition();
        if (winCon !== 0) {
            switch (winCon) {
                case 1:
                    console.log("PLAYER 1 WINS");
                    break;
                case 2:
                    console.log("PLAYER 2 WINS");
                    break;
                case 3:
                    console.log("DRAW");
            }
            gameOver = true;
            return winCon;
        }
        switchPlayerTurn();
        printRound();
        return 0;
    };

    const restartGame = () => {
        activePlayer = (
            players[0].getScore() +
            players[1].getScore() +
            players[2].getScore()) % 2 === 0 ? players[0] : players[1];
        gameOver = false;
        winCon = 0;
        board.clearBoard();
    }

    const newGame = (p1Name, p1Symbol, p2Name, p2Symbol) => {
        players[0].name = p1Name;
        players[0].symbol = p1Symbol;
        players[0].resetScore();
        players[1].name = p2Name;
        players[1].symbol = p2Symbol;
        players[1].resetScore();
        players[2].resetScore();
        restartGame();
    }

    const isGameOver = () => gameOver;

    printRound();

    return {
        playRound,
        getPlayerOne,
        getPlayerTwo,
        getDraws,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver,
        restartGame,
        newGame
    };
}

function ScreenController() {
    const game = GameController();
    const gameGrid = document.querySelector(".game-grid");
    const playerTurn = document.querySelector(".player-info > h2");
    const playerOneSymbol = document.querySelector("#p1-symbol");
    const playerTwoSymbol = document.querySelector("#p2-symbol");
    const playerOneScoreName = document.querySelector("#p1-score-name");
    const playerOneScore = document.querySelector("#p1-score");
    const playerTwoScoreName = document.querySelector("#p2-score-name");
    const playerTwoScore = document.querySelector("#p2-score");
    const drawScore = document.querySelector("#draw-score");
    const restartButton = document.querySelector("#restart-btn");
    const newGameButton = document.querySelector("#new-game-btn");
    const dialog = document.querySelector("dialog");
    const form = document.querySelector("form");
    const playerOneNameInput = document.querySelector("#p1-name-input");
    const playerOneSymbolInput = document.querySelector("#p1-symbol-input");
    const playerTwoNameInput = document.querySelector("#p2-name-input");
    const playerTwoSymbolInput = document.querySelector("#p2-symbol-input");

    const updateScreen = (gameStatus) => {
        gameGrid.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const playerOne = game.getPlayerOne();
        const playerTwo = game.getPlayerTwo();
        const draws = game.getDraws();

        playerOneSymbol.textContent = playerOne.symbol;
        playerTwoSymbol.textContent = playerTwo.symbol;

        if (gameStatus === 1) {
            playerTurn.textContent = `${playerOne.name} WINS!`;
            playerOne.addScore();
        }
        else if (gameStatus === 2) {
            playerTurn.textContent = `${playerTwo.name} WINS!`;
            playerTwo.addScore();
        }
        else if (gameStatus === 3) {
            playerTurn.textContent = "DRAW!"
            draws.addScore();

        }
        else {
            playerTurn.textContent = `< ${activePlayer.name}'s Turn >`;
            if (activePlayer.token === 1) {
                playerOneSymbol.classList.remove("inactive");
                playerTwoSymbol.classList.add("inactive");
                gameGrid.classList.remove("p2-active");
            }
            else {
                playerOneSymbol.classList.add("inactive");
                playerTwoSymbol.classList.remove("inactive");
                gameGrid.classList.add("p2-active");
            }
        }

        playerOneScoreName.textContent = playerOne.name;
        playerOneScore.textContent = playerOne.getScore();
        playerTwoScoreName.textContent = playerTwo.name;
        playerTwoScore.textContent = playerTwo.getScore();
        drawScore.textContent = draws.getScore();

        board.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;
                if (value !== 0) {
                    cellButton.textContent = (value === 1) ?
                        playerOne.symbol :
                        playerTwo.symbol;
                    cellButton.classList.add((value === 1) ?
                        "p1-color" : "p2-color"
                    );
                }
                else {
                    cellButton.classList.add("empty");
                }
                gameGrid.appendChild(cellButton);
            })
        });
    }

    function handleBoardClick(e) {
        const cell = e.target;
        if (cell.classList.contains("cell") && 
            cell.classList.contains("empty") &&
            !game.isGameOver()) {
                const gameStatus = game.playRound(cell.dataset.row, cell.dataset.col);
                updateScreen(gameStatus);
        }
    }
    gameGrid.addEventListener("click", handleBoardClick);

    function handleRestart(e) {
        game.restartGame();
        updateScreen();
    }
    restartButton.addEventListener("click", handleRestart);

    newGameButton.addEventListener("click", (e) => {
        dialog.showModal();
    });

    function handleNewGame(e) {
        e.preventDefault();
        const playerOneName = playerOneNameInput.value ?
            playerOneNameInput.value : "Player 1";
        const playerOneSymbol = playerOneSymbolInput.value ?
            playerOneSymbolInput.value : "X";
        const playerTwoName = playerTwoNameInput.value ?
            playerTwoNameInput.value : "Player 2";
        const playerTwoSymbol = playerTwoSymbolInput.value ?
            playerTwoSymbolInput.value : "O";
        game.newGame(
            playerOneName, playerOneSymbol,
            playerTwoName, playerTwoSymbol);
        updateScreen();
        dialog.close();
    }
    form.addEventListener("submit", handleNewGame);

    updateScreen();
}

ScreenController();

// const game = GameController();
// let gameEnd = false;
// while (!gameEnd) {
//     let input = prompt("Enter Coordinates:");
//     input = input.split(",");
//     gameEnd = game.playRound(input[0], input[1]);
// }
function GameBoard() {
    const size = 3;
    // const board = [];
    const board = [
        [0,1,0],
        [2,0,0],
        [0,1,0]
    ]

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

    // clearBoard();

    return { getBoard, placeToken, checkWinCondition, clearBoard };
}

function Player(name, token, symbol) {
    return { name, token, symbol };
}

function GameController(player1 = "Player 1", player2 = "Player 2") {
    const board = GameBoard();
    
    const players = [
        Player(player1, 1, "X"),
        Player(player2, 2, "O")
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getPlayerOne = () => players[0];

    const getPlayerTwo = () => players[1];

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        console.log(`${activePlayer.name}'s Turn`);
        console.log(board.getBoard());
    };

    const playRound = (row, col) => {
        board.placeToken(row, col, activePlayer.token);
        const winCon = board.checkWinCondition();
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
            return winCon;
        }
        switchPlayerTurn();
        printRound();
        return 0;
    };

    printRound();

    return {
        playRound,
        getPlayerOne,
        getPlayerTwo,
        getActivePlayer,
        getBoard: board.getBoard };
}

function ScreenController() {
    const game = GameController();
    const gameGrid = document.querySelector(".game-grid");
    const playerTurn = document.querySelector(".player-info > h2");

    const updateScreen = () => {
        gameGrid.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `< ${activePlayer.name}'s Turn >`;

        board.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.col = colIndex;
                if (value !== 0) {
                    cellButton.textContent = (value === 1) ?
                        game.getPlayerOne().symbol :
                        game.getPlayerTwo().symbol;
                    cellButton.classList.add((value === 1) ?
                        "p1-color" : "p2-color"
                    );
                }
                else {
                    cellButton.classList.toggle("empty");
                }
                gameGrid.appendChild(cellButton);
            })
        });
    }

    function handleBoardClick(e) {
        const cell = e.target;
        if (cell.classList.contains("cell") && cell.classList.contains("empty")) {
            game.playRound(cell.dataset.row, cell.dataset.col);
            updateScreen();
        }
    }
    gameGrid.addEventListener("click", handleBoardClick);

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
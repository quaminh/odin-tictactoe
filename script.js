function GameBoard() {
    const size = 3;
    const board = [];

    for (let i = 0; i < size; ++i) {
        board[i] = [];
        for (let j = 0; j < size; ++j) {
            board[i].push(0);
        }
    }

    const getBoard = () => board;

    const placeToken = (row, col, player) => {
        if (!board[row][col]) {
            board[row][col] = player;
        }
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

    const printBoard = () => console.log(board);

    return { getBoard, placeToken, checkWinCondition, printBoard };
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

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        console.log(`${activePlayer.name}'s Turn`);
        board.printBoard();
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
            return true;
        }
        switchPlayerTurn();
        printRound();
        return false;
    };

    printRound();

    return { playRound, getActivePlayer };
}

// const game = GameController();
// let gameEnd = false;
// while (!gameEnd) {
//     let input = prompt("Enter Coordinates:");
//     input = input.split(",");
//     gameEnd = game.playRound(input[0], input[1]);
// }
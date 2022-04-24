/* To be comfirmed the web status is ready*/
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var tableRow = document.getElementsByTagName('tr');
    var tableRowData = document.getElementsByTagName('td');
    var tableCell = document.querySelector('.cell');
    var tableCellAll = document.querySelectorAll('.cell');
    const gameStatus = document.querySelector('#game-status');
    const gameRestart = document.querySelector('#game-restart');
    const colCount = 7;
    const rowCount = 6;
    var delayInMilliseconds = 500; // 0,5 second
    let gameActive = true;

    const min = num => Math.max(num - 3, 0);
    const max = (num, max) => Math.min(num + 3, max);

    for (let i = 0; i < tableRowData.length; i++) {
        tableRowData[i].addEventListener('click', (e) => {
            console.log(`${e.target.parentElement.rowIndex}`, `${e.target.cellIndex}`)
        })
    }

    while (!player1) {
        var player1 = prompt('Player One: Enter your name. You will be red.');
    }

    player1Color = 'red';

    /*
    while (!player2) {
        var player2 = prompt('Player Two: Enter your name. You will be yellow.');
    } 
    */

    var player2 = "AI"

    player2Color = 'yellow';

    var currentPlayer;

    function selectFirstPlayer() {
        var randomPlayer = Math.random();
        console.log(randomPlayer);
        if (randomPlayer > 0.5) {
            currentPlayer = player1;
        } else {
            currentPlayer = player2;
        }
        console.log("random player: ", currentPlayer);
    }

    /* Game status message will be displayed when the game gets the winner or draw state.
    The data for current player is dynamic, so the printed data will go with the current player data */
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `You got a tie game!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

    /* The inital message announes the current player turn */
    gameStatus.innerHTML = currentPlayerTurn();

    setNewGame();

    function setNewGame() {
        selectFirstPlayer();
        Array.prototype.forEach.call(tableRowData, (cell) => {
            cell.style.backgroundColor = 'white';
        });
        handlePlayerChange();
        Array.prototype.forEach.call(tableRowData, (cell) => {
            cell.addEventListener('click', handleCellClick);
            cell.style.backgroundColor = 'white';

        });

    }
    /*
    tableCellAll.forEach(element => {
        console.log("here is end table cell: ", element)
    })*/

    //console.log(tableRow[0].childNodes);
    //console.log(tableRow[0].children[0]);
    //console.log("Here is table row data: ", tableRowData[0])

    function handleCellClick(clickedCellEvent) {
        /* The clicked html elements will be saved as varibles to use easier later on */
        const clickedCell = clickedCellEvent.target;
        console.log("data: ", clickedCell);

        const clickedCellIndex = clickedCell.cellIndex;
        const currentRow = clickedCell.parentElement.rowIndex;
        console.log(currentRow);
        console.log(clickedCellIndex);

        /* We need to check the game status and the cell has been played? */
        if (!gameActive) {
            return;
        }

        /* If everything is fine, game flow will be proceeded */

        handleCellPlayed(clickedCellIndex);
        handleResultValidation(clickedCellIndex);

    }

    function handleResultValidation(clickedCellIndex) {

        if (horizontalCheck() || verticalCheck(clickedCellIndex) || diagonalCheck() || diagonalCheck2()) {
            let a = gameStatus.innerHTML = winningMessage();
            gameActive = false;
            return alert(a);
        } else if (drawCheck()) {
            let a = gameStatus.innerHTML = drawMessage();
            gameActive = false;
            return alert(a);
        }
        /* The game will continue here with other player turn */
        //score_position();
        handlePlayerChange();
    }

    function handleCellPlayed(clickedCellIndex) {
        let row = [];

        for (let i = 5; i > -1; i--) {
            if (tableRow[i].children[clickedCellIndex].style.backgroundColor == 'white') {

                row.push(tableRow[i].children[clickedCellIndex]);

                if (currentPlayer === player1) {

                    row[0].style.backgroundColor = player1Color;
                    return;

                } else {

                    row[0].style.backgroundColor = player2Color;
                    return;

                }
            } else if (tableRow[0].children[clickedCellIndex].style.backgroundColor != 'white') {
                alert("This column is full!!!")
                currentPlayer = player2;
                return;
            }
        }

    }

    /* AI test*/
    function ai() {
        //let col = Math.floor(Math.random() * colCount);
        let col = pick_best_move();
        if (is_valid_location(col)) {
            handleCellPlayed(col);
            handleResultValidation(col);
        } else {
            ai();
        }

    }

    /* check the row of two or row of three for calculating the possible position score */
    function score_position(temp_board) {


        var score = 0;
        // Score centre column
        var centre_array = [];
        for (let i = 0; i < rowCount; ++i) {
            centre_array.push(temp_board[i][3]);
        }
        centre_count = centre_array.filter(x => x == 2).length;
        score += centre_count * 6;

        // Score horizontal
        var row_array = [];

        for (let r = 0; r < rowCount; ++r) {
            row_array = temp_board[r];
            //console.log("Here is row array: ", row_array)
            for (let col = 0; col < colCount - 3; col++) {
                let window = [];
                for (let i = col; i < col + 4; i++) {
                    window.push(row_array[i]);
                }
                //console.log("here is window row ", window)
                score += evaluate_window(window);
                if (r == 5 && window.filter(x => x == 1).length == 2 && window.filter(x => x == 0).length == 2) {
                    score -= 80
                }
                //console.log("here is b: ", window.filter(x => x == 2).length)
            }
        }

        // Score vertical
        for (let c = 0; c < colCount; ++c) {
            var col_array = []
            for (let r = 0; r < rowCount; ++r) {
                col_array.push(temp_board[r][c]);
            }
            //console.log("here is col array: ", col_array);
            for (let r = 0; r < rowCount - 3; ++r) {
                let window = [];
                for (let i = r; i < r + 4; ++i) {
                    window.push(col_array[i]);
                }
                //console.log("here is window col ", window)
                score += evaluate_window(window);
                //console.log("here is c: ", window.filter(x => x == 2).length)
            }

        }

        // Score sloped diagonal
        for (let r = 0; r < rowCount - 3; ++r) {
            for (let c = 0; c < colCount - 3; ++c) {
                let window = []
                for (let i = 0; i < 4; ++i) {
                    window[i] = temp_board[r + i][c + i];
                }
                //console.log("here is window sliped diagonal ", window)
                score += evaluate_window(window);
                //console.log("here is d: ", window.filter(x => x == 2).length)
            }
        }

        for (let r = 0; r < rowCount - 3; ++r) {
            for (let c = 0; c < colCount - 3; ++c) {
                let window = [];
                for (let i = 0; i < 4; ++i) {
                    window[i] = temp_board[r + 3 - i][c + i];
                }
                //console.log("here is window sliped diagonal 2", window)
                score += evaluate_window(window);
                //console.log("here is e: ", window.filter(x => x == 2).length)
            }
        }
        console.log("Score now: ", score)
            //let temp_ = create_temp_board();
            //console.log("Temp board: ", temp_)
        return score
    }

    function evaluate_window(window) {
        var score = 0;

        if (window.filter(x => x == 2).length == 4) {
            score += 100
        } else if (window.filter(x => x == 2).length == 3 &&
            window.filter(x => x == 0).length == 1) {
            score += 10
        } else if (window.filter(x => x == 2).length == 2 && window.filter(x => x == 0).length == 2) {
            score += 5
        }

        if (window.filter(x => x == 1).length == 3 && window.filter(x => x == 0).length == 1) {
            score -= 80
        }

        return score;
    }

    function get_valid_locations() {
        var valid_locations = [];

        for (let col = 0; col < colCount; ++col) {
            if (is_valid_location(col)) {
                valid_locations.push(col)
            }
        }
        console.log("Here is valid locations: ", valid_locations)
        return valid_locations;

    }

    function is_valid_location(col) {
        return tableRow[0].children[col].style.backgroundColor == "white";
    }

    function get_next_open_row(col) {
        for (let r = rowCount - 1; r >= 0; --r) {
            if (tableRow[r].children[col].style.backgroundColor == "white") {
                return r;
            }
        }
    }

    function pick_best_move() {
        var valid_locations = get_valid_locations();
        var best_score = -10000;
        var best_col = Math.floor(Math.random() * valid_locations.length);
        for (let col in valid_locations) {
            //console.log("col is: ", col)
            let row = get_next_open_row(valid_locations[col]);
            let temp_board = create_temp_board();
            //console.log("Temp board now: ", temp_board)
            drop_piece(temp_board, row, valid_locations[col]);
            score = score_position(temp_board)
            if (score > best_score) {
                best_score = score;
                best_col = valid_locations[col];
            }
        }
        return best_col;
    }

    function create_temp_board() {
        var temp_board = [];
        for (let i = 0; i < rowCount; ++i) {

            temp_board[i] = new Array();

            for (let j = 0; j < colCount; ++j) {
                if (tableRow[i].children[j].style.backgroundColor == "white") {
                    temp_board[i][j] = 0;
                } else if (tableRow[i].children[j].style.backgroundColor == "red") {
                    temp_board[i][j] = 1;
                } else {
                    temp_board[i][j] = 2;
                }
            }
        }
        return temp_board;
    }

    function drop_piece(temp_board, row, col) {
        temp_board[row][col] = 2;
    }

    /* We change the player turn */
    function handlePlayerChange() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        gameStatus.innerHTML = currentPlayerTurn();
        if (currentPlayer == player2) {
            setTimeout(function() {
                ai();
            }, delayInMilliseconds);
        }
    }


    function colorMatchCheck(one, two, three, four) {
        return (one == two && one == three && one == four && one !== 'white');

    }


    function horizontalCheck() {
        //let currentRow = clickedCell.parentElement.rowIndex;
        for (let row = 0; row < tableRow.length; row++) {
            for (let col = 0; col < 4; col++) {
                if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor,
                        tableRow[row].children[col + 1].style.backgroundColor,
                        tableRow[row].children[col + 2].style.backgroundColor,
                        tableRow[row].children[col + 3].style.backgroundColor)) {
                    return true;
                }
            }
        }
    }

    function verticalCheck(clickedCellIndex) {
        //console.log("clickedCellindex here: ", clickedCellIndex)
        for (let row = 0; row < 3; row++) {
            if (colorMatchCheck(tableRow[row].children[clickedCellIndex].style.backgroundColor,
                    tableRow[row + 1].children[clickedCellIndex].style.backgroundColor,
                    tableRow[row + 2].children[clickedCellIndex].style.backgroundColor,
                    tableRow[row + 3].children[clickedCellIndex].style.backgroundColor)) {
                return true;
            }
        }
    }

    function diagonalCheck() {
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
                if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row + 1].children[col + 1].style.backgroundColor,
                        tableRow[row + 2].children[col + 2].style.backgroundColor, tableRow[row + 3].children[col + 3].style.backgroundColor)) {
                    return true;
                }
            }
        }

    }

    function diagonalCheck2() {
        for (let col = 0; col < 4; col++) {
            for (let row = 5; row > 2; row--) {
                if (colorMatchCheck(tableRow[row].children[col].style.backgroundColor, tableRow[row - 1].children[col + 1].style.backgroundColor,
                        tableRow[row - 2].children[col + 2].style.backgroundColor, tableRow[row - 3].children[col + 3].style.backgroundColor)) {
                    return true;
                }
            }
        }
    }

    function drawCheck() {
        let fullSlot = []
        for (i = 0; i < tableRowData.length; i++) {
            if (tableRowData[i].style.backgroundColor !== 'white') {
                fullSlot.push(tableRowData[i]);
            }
        }
        if (fullSlot.length === tableRowData.length) {
            return true;
        }
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = player1;
        gameStatus.innerHTML = currentPlayerTurn();
        setNewGame();
    }

    /* Event listeners are added into the game cells and restart buttons */
    document.querySelector('#game-restart').addEventListener('click', handleRestartGame);
}
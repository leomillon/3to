/*!
 * 3to v0.1.0
 * Léo Millon <millon.leo@gmail.com>
 * 2014-03-25
 */
var State = {
    X: 'X',
    O: 'O',
    BLANK: null
};

var Selectors = {
    gameStatus: '#game-status',
    gameData: '#game-data',
    socketUrl: '#socket-url',
    gameId: '#game-id',
    cell: '#grid_',
    row: 'data-row',
    column: 'data-column',
    selectedClassName: 'selected',
    selectableClassName: 'selectable',
    validateBtn: '#validate-move-btn'
};

var Messages = {
    WAITING_OPP: 'Waiting for the opponent to join the game...',
    YOUR_TURN: 'It\'s your turn to play',
    OPP_TURN: 'The opponent is playing...',
    YOU_WIN: 'You win !!!',
    YOU_LOSE: 'You lose!!!'
};

var playerState = State.BLANK,
    selectedRow = null,
    selectedColumn = null;

function updateStatus(message) {
    $(Selectors.gameStatus).text(message);
}

function canPlayerPlay(gameData) {
    return gameData.gameReady && gameData.playerTurn === playerState && !gameData.gameOver;
}

function displayableState(state) {
    if (state === State.X || state === State.O) {
        return state;
    }
    return '';
}

function updateGame(gameData) {
    var grid = gameData.grid,
        gridSize = gameData.gridSize;

    if (gameData.gameReady) {
        if (gameData.gameOver) {
            if (gameData.winner === playerState) {
                updateStatus(Messages.YOU_WIN);
            }
            else {
                updateStatus(Messages.YOU_LOSE);
            }
        }
        else if (gameData.playerTurn === playerState) {
            updateStatus(Messages.YOUR_TURN);
        }
        else {
            updateStatus(Messages.OPP_TURN);
        }
    }

    for (var row = 0; row < gridSize; row++) {
        for (var column = 0; column < gridSize; column++) {
            var cellValue = grid[row][column],
                cellElt = $(Selectors.cell + row + '_' + column);

            cellElt.removeClass(Selectors.selectedClassName);
            if (cellValue === State.BLANK && canPlayerPlay(gameData)) {
                cellElt.addClass(Selectors.selectableClassName);
            }
            else {
                cellElt.removeClass(Selectors.selectableClassName);
            }
            cellElt.text(displayableState(cellValue));
        }
    }

    $('.' + Selectors.selectableClassName).on('click', function() {
        $('.' + Selectors.selectedClassName).text(displayableState(State.BLANK));
        $('.' + Selectors.selectableClassName).removeClass(Selectors.selectedClassName);
        $(this).toggleClass(Selectors.selectedClassName).text(displayableState(playerState));
        selectedRow = $(this).attr(Selectors.row);
        selectedColumn = $(this).attr(Selectors.column);
        $(Selectors.validateBtn).removeAttr('disabled');
    });
}

function displayError(message) {
    console.err(message);
}

function unselect() {
    $('.' + Selectors.selectedClassName).removeClass(Selectors.selectedClassName);
    selectedRow = null;
    selectedColumn = null;
    $(Selectors.validateBtn).attr('disabled', 'disabled');
}

updateStatus(Messages.WAITING_OPP);

$(function() {
    var gameDataElt = $(Selectors.gameData),
        socketUrl = gameDataElt.find(Selectors.socketUrl).val(),
        gameId = gameDataElt.find(Selectors.gameId).val(),
        socket = io.connect();//socketUrl);

    socket.on('connect', function() {
        console.log('connected!');
        socket.emit('join game', { gameId: gameId });
    });
    
    socket.on('game joined', function(err, playerId, gameData) {
        if (err == null) {
            playerState = playerId;
            updateGame(gameData);
        }
        else {
            displayError(err);
        }
    });
    
    socket.on('game updated', function(err, gameData) {
        if (err == null) {
            updateGame(gameData);
        }
        else {
            displayError(err);
        }
    });

    socket.on('error', function(err) {
        console.error('Error: ', err);
    });

    $(Selectors.validateBtn).click(function() {
        if (selectedRow != null && selectedColumn != null) {
            socket.emit('player moved', {
                selectedRow: selectedRow,
                selectedColumn: selectedColumn,
                playerState: playerState
            });
            unselect();
        }
    });
});
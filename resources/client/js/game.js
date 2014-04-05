var Constants = common.constants;

var Selectors = {
    body: 'body',
    gameStatus: '.game-status',
    gameData: '#game-data',
    gameId: '#game-id',
    cell: '#grid_',
    row: 'data-row',
    column: 'data-column',
    selectedClassName: 'selected',
    selectableClassName: 'selectable'
};

var Messages = {
    WAITING_OPP: 'Waiting for the opponent to join the game...',
    YOUR_TURN: 'It\'s your turn to play',
    OPP_TURN: 'The opponent is playing...',
    YOU_WIN: 'You win !!!',
    YOU_LOSE: 'You lose!!!',
    NO_WINNER: 'Game is over, nobody win.'
};

var playerState = Constants.State.BLANK,
    shouldExit = true,
    gameRestarted = false,
    socket = null;

var goToHomeCallback = function() {
    if (shouldExit) {
        $(location).attr('href', '/');
    }
    else {
        shouldExit = true;
    }
};

function updateStatus(message) {
    $(Selectors.gameStatus).text(message);
}

function canPlayerPlay(gameData) {
    return gameData.gameReady && gameData.playerTurn === playerState && !gameData.gameOver;
}

function displayableState(state) {
    if (state === Constants.State.X || state === Constants.State.O) {
        return state;
    }
    return '';
}

function displayError(message) {
    shouldExit = false;
    $('#restartModal').modal('hide');
    var $errorModal = $('#errorModal');
    $errorModal.find('.modal-body').text(message);
    $errorModal.modal('show');
}

function unselect() {
    $('.' + Selectors.selectedClassName).removeClass(Selectors.selectedClassName);
}

function sendChoice(selectedRow, selectedColumn) {
    if (selectedRow != null && selectedColumn != null) {
        console.log('Emitting "player moved" event');
        socket.emit('player moved', {
            selectedRow: selectedRow,
            selectedColumn: selectedColumn,
            playerState: playerState
        });
        unselect();
    }
}

function updateGame(gameData) {
    var grid = gameData.grid,
        gridSize = gameData.gridSize;

    var message =  Messages.WAITING_OPP;
    if (gameData.gameReady) {
        if (gameData.gameOver) {
            if (gameData.winner === playerState) {
                message = Messages.YOU_WIN;
            }
            else if (gameData.winner === Constants.State.BLANK) {
                message = Messages.NO_WINNER;
            }
            else {
                message = Messages.YOU_LOSE;
            }
        }
        else if (gameData.playerTurn === playerState) {
            message = Messages.YOUR_TURN;
        }
        else {
            message = Messages.OPP_TURN;
        }
    }
    updateStatus(message);

    for (var row = 0; row < gridSize; row++) {
        for (var column = 0; column < gridSize; column++) {
            var cellValue = grid[row][column],
                cellElt = $(Selectors.cell + row + '_' + column);

            cellElt.removeClass(Selectors.selectedClassName);
            if (cellValue === Constants.State.BLANK && canPlayerPlay(gameData)) {
                cellElt.addClass(Selectors.selectableClassName);
                cellElt.text(displayableState(playerState));
            }
            else {
                cellElt.removeClass(Selectors.selectableClassName);
                cellElt.text(displayableState(cellValue));
            }
        }
    }

    if (gameData.gameOver) {
        $('#restartModal').modal('show');
    }
}

updateStatus(Messages.WAITING_OPP);

$(function() {
    var gameDataElt = $(Selectors.gameData),
        gameId = gameDataElt.find(Selectors.gameId).val();

    socket = io.connect();

    socket.on('connect', function() {
        console.log('connected!');
        socket.emit('join game', { gameId: gameId });
    });

    socket.on('game joined', function(playerId, gameData) {
        playerState = playerId;
        updateGame(gameData);
    });

    socket.on('game updated', function(gameData) {
        updateGame(gameData);
    });

    socket.on('game restarted', function(gameData) {
        gameRestarted = true;
        updateGame(gameData);
    });

    socket.on('error', function(err) {
        displayError(err);
    });

    $(Selectors.body).on('click', '.' + Selectors.selectableClassName, function() {
        $('.' + Selectors.selectedClassName).text(displayableState(Constants.State.BLANK));
        $('.' + Selectors.selectableClassName).removeClass(Selectors.selectedClassName);
        $(this).toggleClass(Selectors.selectedClassName).text(displayableState(playerState));
        var selectedRow = $(this).attr(Selectors.row);
        var selectedColumn = $(this).attr(Selectors.column);
        sendChoice(selectedRow, selectedColumn);
    });

    $('#errorModal').on('hidden.bs.modal', goToHomeCallback);
    $('#restartModal').on('hidden.bs.modal', goToHomeCallback);
    $('#restart-btn').on('click', function() {
        shouldExit = false;
        $('#restartModal').modal('hide');
        if (!gameRestarted) {
            socket.emit('restart game');
        }
        else {
            gameRestarted = false;
        }
    });
});
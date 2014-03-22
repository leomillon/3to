function isUndefined(variable) {
    return typeof variable === 'undefined';
}

var Constants = {
    State: {
        X: 'X',
        O: 'O',
        BLANK: null
    },
    MIN_PLAYER: 2,
    MAX_PLAYER: 2,
    MAX_GRID_SIZE: 3
}

var games = [];

function Game(id) {
    // Private
    var players = [];
    var grid;
    var gridSize = Constants.MAX_GRID_SIZE;
    var moveCount;
    var gameOver;
    var lastPlayerState;
    var winnerState;

    var init = function () {
        grid = [];

        for (var i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (var j = 0; j < gridSize; j++) {
                grid[i][j] = Constants.State.BLANK;
            }
        }

        gameOver = false;
        winnerState = Constants.State.BLANK;
        moveCount = 0;
        lastPlayerState = winnerState;
    }

    var endGame = function (state) {
        gameOver = true;
        winnerState = state;
    }

    var checkWinner = function (row, column, state) {
        lastPlayerState = state;
        // Check columns
        for (var i = 0; i < gridSize; i++) {
            if (grid[row][i] != state) {
                break;
            }
            if (i == gridSize - 1) {
                endGame(state);
                return;
            }
        }

        // Check rows
        for (var i = 0; i < gridSize; i++) {
            if (grid[i][column] != state) {
                break;
            }
            if (i == gridSize - 1) {
                endGame(state);
                return;
            }
        }

        // Check diag
        if (row == column) {
            for (var i = 0; i < gridSize; i++) {
                if (grid[i][i] != state) {
                    break;
                }
                if (i == gridSize - 1) {
                    endGame(state);
                    return;
                }
            }
        }

        // Check anti-diag
        for (var i = 0; i < gridSize; i++) {
            if (grid[i][(gridSize - 1) - i] != state) {
                break;
            }
            if (i == gridSize - 1) {
                endGame(state);
                return;
            }
        }

        // Check draw
        if (moveCount == (Math.pow(gridSize,2) - 1)) {
            endGame(Constants.State.BLANK);
            return;
        }
    }

    var stateToPlay = function() {
        if (lastPlayerState == Constants.State.BLANK || lastPlayerState == Constants.State.O) {
            return Constants.State.X;
        }
        return Constants.State.O;
    }

    var isReadyToStart = function() {
        return players.length == Constants.MIN_PLAYER;
    }

    // Public
    this.id = id;

    /**
     * Reset the grid
     */
    this.resetGrid = function () {
        init();
    }

    /**
     * Add a new player to the game
     *
     * @returns {string} the player id ('x' or 'o')
     *
     * @throws Error if there is already 2 players
     */
    this.newPlayer = function() {
        var playerNumber = players.length;
        if (playerNumber < Constants.MAX_PLAYER) {
            var playerId = "";
            if (playerNumber == 0) {
                playerId = Constants.State.X;
            }
            else {
                playerId = Constants.State.O;
            }
            players.push(playerId);
            return playerId;
        }
        throw new Error("Unable to create user, there is already 2 users defined");
    };

    this.move = function(row, column, state) {
        if (grid[row][column] == Constants.State.BLANK) {
            grid[row][column] = state;
        }
        moveCount++;

        return checkWinner(row, column, state);
    };

    this.extractGameData = function() {
        return {
            gameId: id,
            grid: grid,
            gridSize: gridSize,
            gameReady: isReadyToStart(),
            gameOver: gameOver,
            playerTurn: stateToPlay(),
            winner: winnerState
        }
    };

    init();
}

function getGame(gameId) {
    return games[gameId];
}

function createGame(gameId) {
    var createdGame = new Game(gameId);
    games[createdGame.id] = createdGame;
    return createdGame;
}

/**
 * Add a new player to the game (creating a new game if needed)
 *
 * @param gameId
 * @returns string player id ('x' or 'o')
 *
 * @throws Error if there is already 2 players
 * @see {@link Game#newPlayer}
 */
exports.joinGame = function(gameId, callback) {
    var game = getGame(gameId);
    if (isUndefined(game)) {
        game = createGame(gameId);
    }
    try {
        callback(null, game.newPlayer(), game.extractGameData());
    }
    catch (e) {
        callback(e, null);
    }
};

exports.move = function(gameId, data, callback) {
    var game = getGame(gameId);
    if (!isUndefined(game)) {
        game.move(data.selectedRow, data.selectedColumn, data.playerState);
        callback(null, game.extractGameData());
    }
    else {
        callback("No game defined for id " + gameId, null);
    }
}
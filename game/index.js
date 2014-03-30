var shortIdGenerator = require('shortid');
var CommonModule = require('../resources/js/common');
var Constants = CommonModule.constants;
var utils = CommonModule.utils;

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
    };

    var endGame = function (state) {
        gameOver = true;
        winnerState = state;
    };

    var checkWinner = function (row, column, state) {
        // Check columns
        for (var i = 0; i < gridSize; i++) {
            if (checkLine(row, i, i, gridSize, state)) {
                break;
            }
        }

        // Check rows
        for (var j = 0; j < gridSize; j++) {
            if (checkLine(j, column, j, gridSize, state)) {
                break;
            }
        }

        // Check diag
        if (row === column) {
            for (var k = 0; k < gridSize; k++) {
                if (checkLine(k, k, k, gridSize, state)) {
                    break;
                }
            }
        }

        // Check anti-diag
        for (var l = 0; l < gridSize; l++) {
            if (checkLine(l, (gridSize - 1) - l, l, gridSize, state)) {
                break;
            }
        }

        // Check draw
        if (moveCount === (Math.pow(gridSize,2) - 1)) {
            endGame(Constants.State.BLANK);
        }
    };

    var checkLine = function(row, column, index, size, state) {
        if (grid[row][column] !== state) {
            return true;
        }
        if (index === size - 1) {
            endGame(state);
            return true;
        }
        return false;
    };

    var stateToPlay = function() {
        if (lastPlayerState === Constants.State.BLANK || lastPlayerState === Constants.State.O) {
            return Constants.State.X;
        }
        return Constants.State.O;
    };

    var isReadyToStart = function() {
        return players.length === Constants.MIN_PLAYER;
    };

    // Public
    this.id = id;

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
            if (playerNumber === 0) {
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
        lastPlayerState = state;
        if (grid[row][column] === Constants.State.BLANK) {
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
        };
    };

    init();
}

function getGame(gameId) {
    return games[gameId];
}

function doesGameExist(gameId) {
    return utils.isDefined(getGame(gameId));
}

function createGame(gameId) {
    var createdGame = new Game(gameId);
    games[createdGame.id] = createdGame;
    return createdGame;
}

exports.doesGameExist = function(gameId, callback) {
    callback(gameId, doesGameExist(gameId));
};

/**
 * Add a new player to the game (creating a new game if needed)
 *
 * @param gameId
 * @param callback
 * @returns string player id ('x' or 'o')
 *
 * @throws Error if there is already 2 players
 * @see {@link Game#newPlayer}
 */
exports.joinGame = function(gameId, callback) {
    var game = getGame(gameId);
    if (utils.isUndefined(game)) {
        callback('Game does not exist');
    }
    try {
        callback(null, game.newPlayer(), game.extractGameData());
    }
    catch (e) {
        callback(e);
    }
};

exports.gameCreate = function(callback) {
    var game;
    var MAX_TRY = 10;
    var gameId;
    var i = 0;
    do {
        gameId = shortIdGenerator.generate();
        game = getGame(gameId);
        i ++;
    } while (utils.isUndefined(game) && i <= MAX_TRY);
    game = createGame(gameId);
    if (utils.isUndefined(game)) {
        console.error('Unable to create a new unique game');
        callback('An error occured, please try later.');
    }
    else {
        callback(null, game.id);
    }
};

exports.move = function(gameId, data, callback) {
    var game = getGame(gameId);
    if (utils.isDefined(game)) {
        game.move(data.selectedRow, data.selectedColumn, data.playerState);
        callback(null, game.extractGameData());
    }
    else {
        callback("No game defined for id " + gameId, null);
    }
};
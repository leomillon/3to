var games = [];

function Game(id) {
    // Private
    players = [];

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
        if (playerNumber < 2) {
            var playerId = "";
            if (playerNumber == 0) {
                playerId = 'x';
            }
            else {
                playerId = 'o';
            }
            players.push(playerId);
            return playerId;
        }
        throw new Error("Unable to create user, there is already 2 users defined");
    };
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
exports.joinGame = function(gameId) {
    var game = getGame(gameId);
    if (!game) {
        game = createGame(gameId);
    }
    return game.newPlayer();
};

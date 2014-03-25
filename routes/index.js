var path = require('path'),
    game = require('../game');

function isDefined(variable) {
    return typeof variable !== 'undefined';
}

function renderError(req, res, data) {
    res.render('error', data);
}

function renderSimpleError(req, res, errorTitle, errorMessage) {
    renderError(req, res, {
        errorTitle: errorTitle,
        errorMessage: errorMessage
    });
}

function joinGame(req, res, gameId) {
    game.doesGameExist(gameId, function(gameId, result) {
        if (result) {
            res.render('game', {
                title: '3to',
                description: 'TicTacToe Online',
                gameId: gameId
            });
        }
        else {
            renderSimpleError(req, res, "Unable to join game", "The game with ID '" + gameId + "' does not exist");
        }
    });
}

function createGame(req, res) {
    game.createGame(function(err, gameId) {
        if (err == null) {
            res.render('game_created', {
                gameUrl: path.join('/', 'game', gameId, 'join')
            });
        }
        else {
            renderSimpleError(req, res, "Unable to create game", err);
        }
    });
}

/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index', {
      title: '3to',
      description: 'TicTacToe Online'
  });
};

exports.indexActions = function(req, res) {
    var body = req.body;

    if (isDefined(body.join_game)) {
        res.redirect(path.join('/', 'game', body.gameId, 'join'));
    }
    else if (isDefined(body.create_game)) {
        res.redirect(path.join('/', 'game', 'create'));
    }
};

exports.joinGame = function(req, res) {
    joinGame(req, res, req.params.gameId);
};

exports.createGame = function(req, res) {
    createGame(req, res);
};

exports.renderError = renderError;
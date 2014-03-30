var path = require('path');
var game = require('../game');
var utils = require('../resources/js/common').utils;

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
            res.render('game', { gameId: gameId });
        }
        else {
            renderSimpleError(req, res, "Unable to join game", "The game with ID '" + gameId + "' does not exist");
        }
    });
}

function createGame(req, res) {
    game.gameCreated(function(err, gameId) {
        if (err == null) {
            res.redirect(path.join('/', 'game', gameId, 'created'));
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
  res.render('index');
};

exports.indexActions = function(req, res) {
    var body = req.body;

    if (utils.isDefined(body.join_game)) {
        res.redirect(path.join('/', 'game', body.gameId, 'join'));
    }
    else if (utils.isDefined(body.create_game)) {
        createGame(req, res);
    }
};

exports.joinGame = function(req, res) {
    joinGame(req, res, req.params.gameId);
};

exports.gameCreated = function(req, res) {
    var gameId = req.params.gameId;
    res.render('game_created', {
        gameId: gameId,
        gameUrl: path.join('/', 'game', gameId, 'join')
    });
};

exports.renderError = renderError;
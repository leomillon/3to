var path = require('path');
var game = require('../game');
var utils = require('../../common').utils;
var debug = require('debug')('3to:routes');
var shortIdGenerator = require('shortid');

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
    game.gameCreate(function(err, gameId) {
        if (err == null) {
            res.render('game_created', {
                gameId: gameId,
                gameUrl: path.join('/', 'game', gameId, 'join')
            });
        }
        else {
            renderSimpleError(req, res, "Unable to create game", err);
        }
    });
}

exports.registerUserInfo = function(req, res, next) {
    if (utils.isUndefined(req.session.userId)) {
        req.session.userId = shortIdGenerator.generate();
        debug('New user id defined :', req.session.userId);
    }
    next();
};

/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index');
};

exports.joinGame = function(req, res) {
    if (utils.isPost(req.method)) {
        res.redirect(path.join('/', 'game', req.body.gameId, 'join'));
    }
    else if (utils.isGet(req.method)) {
        joinGame(req, res, req.params.gameId);
    }
};

exports.gameCreate = function(req, res) {
    createGame(req, res);
};

exports.renderError = renderError;
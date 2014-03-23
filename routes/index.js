var path = require('path');

function isDefined(variable) {
    return typeof variable !== 'undefined';
}

function joinGame(req, res, gameId) {
    res.render('game', {
        title: '3to',
        description: 'TicTacToe Online',
        socketUrl: "http://192.168.1.4:3000",
        gameId: gameId
    });
}

function createGame(req, res, gameId) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Created game ' + gameId);
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
        res.redirect(path.join('/', 'game', body.gameId, 'create'));
    }
};

exports.joinGame = function(req, res) {
    joinGame(req, res, req.params.gameId);
};

exports.createGame = function(req, res) {
    createGame(req, res, req.params.gameId);
};
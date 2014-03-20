var path = require('path');

function joinGame(req, res, gameId) {
    res.render('game', {
        title: '3to',
        description: 'TicTacToe Online',
        socketUrl: "http://localhost:3000",
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

    if (typeof body.join_game !== 'undefined') {
        res.redirect(path.join('/', 'game', body.gameId, 'join'));
    }
    else if (typeof body.create_game !== 'undefined') {
        res.redirect(path.join('/', 'game', body.gameId, 'create'));
    }
};

exports.joinGame = function(req, res) {
    joinGame(req, res, req.params.gameId);
}

exports.createGame = function(req, res) {
    createGame(req, res, req.params.gameId);
}
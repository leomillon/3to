
/**
 * Module dependencies.
 */

var pjson = require('./package.json');
var express = require('express');
var app = express();
var routes = require('./routes');
var game = require('./game');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var swig = require('swig');

swig.setDefaults({
    locals: {
        pkg: pjson
    }
});

// all environments
app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.set('view cache', false);
}

app.get('/', routes.index)
    .post('/', routes.indexActions)
    .get('/game/:gameId/join', routes.joinGame)
    .get('/game/create', routes.createGame)
    .use(function(req, res) {
        var errorCode = 404;
        res.status(errorCode);
        routes.renderError(req, res, {
            errorTitle: errorCode,
            errorMessage: 'Page not found'
        });
    })
    .use(function(error, req, res, next) {
        var errorCode = error.status || 500;
        res.status(errorCode);
        routes.renderError(req, res, {
            errorTitle: errorCode,
            errorMessage: error
        });
    });

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {

    socket.on('join game', function(data) {
        var gameId = data.gameId;

        game.joinGame(gameId, function(err, playerId, gameData) {
            if (err == null) {
                socket.set('gameId', gameData.gameId);
                socket.set('playerId', playerId);
                socket.join(gameId);

                socket.emit('game joined', err, playerId, gameData);
                socket.broadcast.to(gameId).emit('game updated', err, gameData);
            }
            else {
                console.error(err);
                socket.emit('error', err);
            }
        });
    });

    socket.on('player moved', function(data) {
        socket.get('gameId', function(err, gameId) {
            game.move(gameId, data, function (err, gameData) {
                io.sockets.in(gameId).emit('game updated', err, gameData);
            })
        });
    });

});

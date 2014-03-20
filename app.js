
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var game = require('./game');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
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
}

app.get('/', routes.index)
    .post('/', routes.indexActions)
    .get('/game/:gameId/join', routes.joinGame)
    .get('/game/:gameId/create', routes.createGame)
    .use(function(req, res) {
        res.status(404);
        res.render('error', {
            errorCode: '404',
            errorMessage: 'Page not found'
        });
    });

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {

    socket.on('join game', function(data) {
        var gameId = data.game;

        try {
            var playerId = game.joinGame(gameId);
            socket.set('gameId', gameId);
            socket.set('playerId', playerId);
            socket.join(gameId);

            socket.emit('game joined', { playerId: playerId });
        }
        catch (e) {
            console.error('Unable to join game ', gameId, '. Reason : ', e);
        }

    });

});

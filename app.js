var pjson = require('./package.json');
var express = require('express');
var app = express();
var debug = require('debug')('3to:app');
var routes = require('./resources/server/routes');
var game = require('./resources/server/game');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var swig = require('swig');

// template locals
swig.setDefaults({
    locals: {
        pkg: pjson,
        resources: {
            suffix: pjson.version + ".min"
        }
    }
});

// all environments
app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'resources/server/views'));
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'helloguys!' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.set('view cache', false);
}

app.get('*', routes.registerUserInfo)
    .get('/', routes.index)
    .post('/game/join', routes.joinGame)
    .get('/game/:gameId/join', routes.joinGame)
    .post('/game/create', routes.gameCreate)
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
            errorMessage: error.message
        });
    });

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {

    socket.on('join game', function(data) {
        var gameId = data.gameId;

        debug('Player want to join game \'%s\'', data.gameId);

        game.joinGame(gameId, function(err, playerId, gameData) {
            if (err == null) {
                socket.set('gameId', gameData.gameId);
                socket.set('playerId', playerId);
                socket.join(gameId);

                socket.emit('game joined', err, playerId, gameData);
                socket.broadcast.to(gameId).emit('game updated', err, gameData);
            }
            else {
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

    socket.on('disconnect', function() {
        socket.get('gameId', function(err, gameId) {
            socket.broadcast.to(gameId).emit('error', 'The opponent has left the game...');
        });
    });

});

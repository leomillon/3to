var gameDataSelector = "#game-data",
    socketUrlSelector = "#socket-url",
    gameIdSelector = "#game-id",
    playerLetter = "O";

$(document).ready(function() {
    /*var gameDataElt = $(gameDataSelector),
        socketUrl = gameDataElt.find(socketUrlSelector).val(),
        gameId = gameDataElt.find(gameIdSelector).val(),
        socket = io.connect(socketUrl);

    socket.on('connect', function() {
        console.log('connected!');
        socket.emit('join game', { gameId: gameId });
    });

    socket.on('error', function(err) {
        console.error("Error: ", err);
    });*/

    $('.selectable').click(function (event) {
        var selectedClassName = 'selected';
        $('.selectable').removeClass(selectedClassName).text('');
        $(this).toggleClass(selectedClassName).text(playerLetter);
    });
});
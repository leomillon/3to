var socket = io.connect(document.URL);

displaySocketStatus(socket.socket.connected, null);

socket.on('connect', function() {
    displaySocketStatus(socket.socket.connected, null);
});

socket.on('connected', function(message) {
    displaySocketStatus(socket.socket.connected, message);
});

function displaySocketStatus(socketStatus, serverMessage) {
    console.log("Status : " + socketStatus);
    console.log("Message received from server : " + serverMessage);
    var message, status;
    if (socketStatus) {
        status = "Connected!";
    }
    else {
        status = "Error - Not connected...";
    }
    if (serverMessage) {
        message = serverMessage;
    }
    else {
        message = "N/A";
    }
    $("#socket-status").find(".value").text(status);
    $("#socket-message").find(".value").text(message);
}
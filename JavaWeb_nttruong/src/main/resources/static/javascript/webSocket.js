const stompClient = new StompJs.Client({
	brokerURL: 'ws://localhost:8080/websocket'
});

stompClient.onConnect = (frame) => {
	setConnected(true);
	console.log('Connected: ' + frame);
};

stompClient.onWebSocketError = (error) => {
	console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
	console.error('Broker reported error: ' + frame.headers['message']);
	console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected) {
		$("#conversation").show();
	}
	else {
		$("#conversation").hide();
	}
	$("#greetings").html("");
}

function connectWebsocket() {
	stompClient.activate();
}

function disconnectWebsocket() {
	stompClient.deactivate();
	setConnected(false);
	console.log("Disconnected");
}

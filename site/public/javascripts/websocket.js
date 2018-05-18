var exampleSocket;

function socketDemo() {
	exampleSocket = new WebSocket("ws://localhost:40510/socketserver", "protocolOne");
	exampleSocket.onopen = function (event) {
		$('#demo-responses').append("Ask me to tell you a joke: Try 'tell me a joke'" + '<br />')
	};
	exampleSocket.onmessage = function (ev) {
		$('#demo-responses').append(`[Server] ` + ev.data + `<br />`);
		console.log(ev)
	}
}

function sendToDemo(text) {
	exampleSocket.send(text);
}

function onSendMessage() {
	let response = $('#text-demo').val();
	$('#demo-responses').append(">" + response + `<br />`)
	exampleSocket.send(response)
}
import ShifterbeltClient from './shiflterbelt-client.js'

let shifterbeltClient = new ShifterbeltClient({
    url: 'http://localhost:3000/ns',
    applicationId: 998494289165,
    key: process.argv.slice(2,3)[0] || 'd9bc1414249500b884a432bda1e4cb378b1945b5',
    password: process.argv.slice(3)[0] || 'M+cKkcKtMfjQc03NfwKwKKA3FzO3RwJXwFBZb9J4eIany5o8hN/3pf6JMDKH9+k/6SgklrqWf7G5yFeV'
});

shifterbeltClient.on('connect', function(){
	console.log("connected on port 3000");
    shifterbeltClient.emit('test', 'first device message');
});
shifterbeltClient.on('event', function(message){
	console.log("message: " + message);
});
shifterbeltClient.on('test', function (message) {
    console.log('message: ' + message);
});
shifterbeltClient.on('disconnect', function(){
	console.log("has been disconnected");
});
shifterbeltClient.on('error', function(message) {
    console.log(`There is an error: ${message}`);
});

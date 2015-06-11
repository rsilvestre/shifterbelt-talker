var ShifterbeltClient = require('../../lib/ShifterbeltClient.js');

var shifterbeltClient = new ShifterbeltClient({
  url: String(process.argv.slice(2,3)[0]),
  applicationId: Number(process.argv.slice(3, 4)[0]),
  key: process.argv.slice(4, 5)[0],
  password: process.argv.slice(5, 6)[0],
  //macAddress: process.argv.slice(6).toString()
});

shifterbeltClient.on('connect', function(socket) {
  console.log("connected on Shifterbelt");
  var count = 0;
  if (socket.role === "slave") {
    setInterval(function() {
      socket.emit('test', "first device message, " +  (count++) );
    }, 3000);
  }

  if (socket.role === "master") {
    setInterval(function() {
      socket.emit('test', 'b8e8563aa597', 'first device message, ' + (count++));
    }, 3000);
  }

  socket.on('gps_data', function(sender, message){
    console.log('message from: ' + sender + ', contain: ' + message);
  });

  socket.on('event', function(message) {
    console.log('message: ' + message);
  });

  if (socket.role === "slave") {
    socket.on('test', function(message) {
      console.log('message: '+ message);
    });
  }

  if (socket.role === "master") {
      socket.on('test', function(sender, message) {
      console.log('sender: ' + sender + ', message: ' + message);
    });
  }

  socket.on('disconnect', function() {
    console.log("has been disconnected");
  });
});

shifterbeltClient.on('error', function(message) {
  console.log('There is an error: ' + message);
});

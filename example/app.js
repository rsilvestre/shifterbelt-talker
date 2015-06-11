var ShifterbeltClient = require('../lib/ShifterbeltClient.js');

var shifterbeltClient = new ShifterbeltClient({
  applicationId: APP_ID,
  key: "KEY",
  password: "PASSWORD",
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
      socket.emit('test', 'MAC_ADDRESS_OF_THE_SLAVE', 'first device message, ' + (count++));
    }, 3000);
  }

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

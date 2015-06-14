var ShifterbeltClient = require('../lib/ShifterbeltClient.js');

var shifterbeltClient = new ShifterbeltClient({
  applicationId: APP_ID,
  key: "KEY",
  password: "PASSWORD",
});

shifterbeltClient.on('connect', function(socket) {
  console.log("connected on Shifterbelt");
  socket.on('connect', function(service) {
    console.log('device connected');
    service.on('test', function(message) {
      console.log('sender: ' + service.deviceId + ', message: ' + message);
    });
    var countMaster = 0;
    var intervalStop = setInterval(function() {
      service.emit('test', 'first device message, ' + (countMaster++));
    }, 3000);
    service.on('disconnect', function() {
      clearInterval(intervalStop);
    })
  });

  //var countSlave = 0;
  //if (socket.role === "slave") {
  //  setInterval(function() {
  //    socket.emit('test', "first device message, " + (countSlave++));
  //  }, 3000);
  //}

  socket.on('event', function(message) {
    console.log('message: ' + message);
  });

  if (socket.role === "slave") {
    socket.on('test', function(message) {
      console.log('message: '+ message);
    });
  }

  socket.on('disconnect', function() {
    console.log("has been disconnected");
  });
});

shifterbeltClient.on('error', function(message) {
  console.log('There is an error: ' + message);
});

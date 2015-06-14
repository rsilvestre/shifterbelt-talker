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
  socket.on('connect', function(service) {
    console.log('device connected');
    socket.on('gps_data', function(message){
      console.log('message from: ' + service.deviceId + ', contain: ' + message);
    });
    service.on('disconnect', function() {
      console.warn('The device: ' + service.deviceId + ', has been disconnected');
    })
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

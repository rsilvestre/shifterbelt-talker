'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _shiflterbeltClientJs = require('../shiflterbelt-client.js');

var _shiflterbeltClientJs2 = _interopRequireDefault(_shiflterbeltClientJs);

var shifterbeltClient = new _shiflterbeltClientJs2['default']({
  url: String(process.argv.slice(2, 3)[0]),
  applicationId: Number(process.argv.slice(3, 4)[0]),
  key: process.argv.slice(4, 5)[0],
  password: process.argv.slice(5, 6)[0],
  macAddress: process.argv.slice(6).toString()
});

shifterbeltClient.on('connect', function (socket) {
  console.log('connected on port 3000');
  socket.emit('test', 'first device message');

  socket.on('event', function (message) {
    console.log('message: ' + message);
  });

  socket.on('test', function (message) {
    console.log('message: ' + message);
  });

  socket.on('disconnect', function () {
    console.log('has been disconnected');
  });
});

shifterbeltClient.on('error_system', function (message) {
  console.log('There is an error: ' + message);
});

//# sourceMappingURL=app.js.map
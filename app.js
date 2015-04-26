'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _ShifterbeltClient = require('./shiflterbelt-client.js');

var _ShifterbeltClient2 = _interopRequireWildcard(_ShifterbeltClient);

var shifterbeltClient = new _ShifterbeltClient2['default']({
    url: 'http://localhost:3000/ns',
    applicationId: 123,
    key: 'toto',
    password: 'tata'
});

shifterbeltClient.on('connect', function () {
    console.log('connected on port 3000');
    shifterbeltClient.emit('test', 'first device message');
});
shifterbeltClient.on('event', function (message) {
    console.log('message: ' + message);
});
shifterbeltClient.on('disconnect', function () {
    console.log('has been disconnected');
});
shifterbeltClient.on('error', function (message) {
    console.log('There is an error: ' + message);
});

//# sourceMappingURL=app.js.map
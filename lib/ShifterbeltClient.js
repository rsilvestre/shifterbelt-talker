/**
 * Created by michaelsilvestre on 25/04/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var _getmac = require('getmac');

var _getmac2 = _interopRequireDefault(_getmac);

var _libValidateOptions = require('./lib/ValidateOptions');

var _libValidateOptions2 = _interopRequireDefault(_libValidateOptions);

var _libAnalyseAnalyseMessage = require('./lib/analyse/AnalyseMessage');

var _libAnalyseAnalyseMessage2 = _interopRequireDefault(_libAnalyseAnalyseMessage);

var _libDeviceRole = require('./lib/DeviceRole');

var _libDeviceRole2 = _interopRequireDefault(_libDeviceRole);

var _util = require('util');

var ShifterbeltClient = (function () {

  /**
   *
   * @param {Object} options
   */

  function ShifterbeltClient(options) {
    var _this = this;

    _classCallCheck(this, ShifterbeltClient);

    this._messageInternalOut = new _events2['default'].EventEmitter();
    this._messageOut = null;
    this._messageIn = null;

    this._analyseMessage = null;
    this._deviceRole = null;

    // Setted dynamically
    //this._masters = {};
    //this._managers = {};
    this._slaves = {};

    options = (0, _util._extend)({ url: 'http://socket.shifterbelt.com/ns' }, options);

    _getmac2['default'].getMac(function (err, macAddress) {
      options.macAddress = options.macAddress || macAddress; // TODO : Remove: "options.macAddress ||"
      _this.init(options);
    });
  }

  _createClass(ShifterbeltClient, [{
    key: 'init',

    /**
     *
     * @param {Object} options
     */
    value: function init(options) {
      var _this2 = this;

      var valid = new _libValidateOptions2['default'](options).execute();

      if (valid.err) {
        return console.log(valid.err.message);
      }

      this._socket = (0, _socketIoClient2['default'])(valid.result.url, { query: valid.result.options });

      this._socket.on('connect', function () {
        _this2._messageOut = new _events2['default'].EventEmitter();
        _this2._messageIn = new _events2['default'].EventEmitter();

        _this2._socket.on('error_system', function (message) {
          _this2._messageInternalOut.emit('error', message);
        });

        _this2._socket.emit('authenticate', JSON.stringify(valid.result.raw));

        _this2._socket.on('authenticated', function () {
          _this2._authenticated();
        });
      });

      this._socket.on('disconnect', function () {
        _this2._deviceRole.isConnected = false;
        _this2._messageInternalOut.emit('disconnect');
        _this2._messageIn.emit('disconnect');
        _this2._messageIn.removeAllListeners('');

        _this2._messageOut = null;
        _this2._messageIn = null;

        _this2._analyseMessage = null;
        _this2._deviceRole = null;
      });
    }
  }, {
    key: '_authenticated',

    /**
     *
     * @private
     */
    value: function _authenticated() {
      var _this3 = this;

      this._analyseMessage = new _libAnalyseAnalyseMessage2['default'](this, function (deviceRole) {
        _this3._deviceRole = deviceRole.device;

        _this3._messageInternalOut.emit('connect', _this3._deviceRole);
      });

      this._socket.on('message', function (message) {
        _this3._internalOnMessage(message);
      });

      this._socket.on('service', function (message) {
        console.log('receive service message');
        _this3._internelOnService(message);
      });

      this._messageOut.addListener('send', function () {
        for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
          data[_key] = arguments[_key];
        }

        if (data.length === 1) {
          return _this3._socket.emit('message', data[0]);
        }

        _this3._socket.emit('message', JSON.stringify({
          key: data[0],
          message: data[1]
        }));
      });
    }
  }, {
    key: '_internalOnMessage',

    /**
     *
     * @param {Object} message
     * @private
     */
    value: function _internalOnMessage(message) {

      if (message.hasOwnProperty('content')) {
        var result = JSON.parse(message.content.toString());

        if (result.hasOwnProperty('slaveId')) {
          //return this._messageIn.emit(result['key'], result['slaveId'], result['value']);
          return this._messageIn.emit(result['slaveId'], { key: result['key'], value: result['value'] });
        } else {
          return this._messageIn.emit(result['key'], result['value']);
        }
      }

      var keys = Object.keys(message);
      if (keys.length !== 1) {
        return;
      }
      this._messageIn.emit(keys[0], message[keys[0]]);
    }
  }, {
    key: '_internelOnService',

    /**
     *
     * @param {{}} message
     * @private
     */
    value: function _internelOnService(message) {
      this._analyseMessage.execute(message);
    }
  }, {
    key: 'on',

    /**
     *
     * @param {String} event
     * @param {Function} callback
     */
    value: function on(event, callback) {
      this._messageInternalOut.addListener(event, callback);
    }
  }]);

  return ShifterbeltClient;
})();

exports['default'] = ShifterbeltClient;
module.exports = exports['default'];
//# sourceMappingURL=ShifterbeltClient.js.map
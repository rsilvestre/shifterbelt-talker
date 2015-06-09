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

var _libValidateOptionsJs = require('./lib/ValidateOptions.js');

var _libValidateOptionsJs2 = _interopRequireDefault(_libValidateOptionsJs);

var _libAnalyseMessageJs = require('./lib/AnalyseMessage.js');

var _libAnalyseMessageJs2 = _interopRequireDefault(_libAnalyseMessageJs);

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
    this._messageOut = new _events2['default'].EventEmitter();
    this._messageIn = new _events2['default'].EventEmitter();

    this._analyseMessage = {};
    this._exchange = {};

    // Setted dynamically
    this._masters = {};
    this._managers = {};
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

      var valide = new _libValidateOptionsJs2['default'](options).execute();

      if (valide.err) {
        return console.log(valide.err.message);
      }

      this._socket = (0, _socketIoClient2['default'])(valide.result.url, { query: valide.result.options });

      this._socket.on('connect', function () {
        _this2._socket.on('error_system', function (message) {
          _this2._messageInternalOut.emit('error_system', message);
        });

        _this2._socket.emit('authenticate', JSON.stringify(valide.result.raw));

        _this2._socket.on('authenticated', function () {
          _this2._authenticated();
        });
      });

      this._socket.on('disconnect', function () {
        _this2._exchange.isConnected = false;
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

      this._analyseMessage = new _libAnalyseMessageJs2['default'](this, function (role) {
        var Exchange = require('./lib/Exchange' + role.charAt(0).toUpperCase() + '' + role.substring(1).toLowerCase() + '.js');

        _this3._exchange = new Exchange(_this3._messageOut, _this3._messageIn, role);
        _this3._exchange.isConnected = true;

        _this3._messageInternalOut.emit('connect', _this3._exchange);
      });

      this._socket.on('message', function (message) {
        _this3._internalOnMessage(message);
      });

      this._socket.on('service', function (message) {
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
          return this._messageIn.emit(result['key'], result['slaveId'], result['value']);
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

//# sourceMappingURL=ShiflterbeltClient.js.map
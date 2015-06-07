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

var Exchange = (function () {
  function Exchange(messageOut, messageIn) {
    _classCallCheck(this, Exchange);

    this._messageOut = messageOut;
    this._messageIn = messageIn;
  }

  _createClass(Exchange, [{
    key: 'on',

    /**
     *
     * @param {String} event
     * @param {Function} callback
     */
    value: function on(event, callback) {
      this._messageIn.addListener(event, callback);
    }
  }, {
    key: 'emit',

    /**
     *
     * @param {String} event
     * @param {Arguments} args
     */
    value: function emit(event) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!this._connected) {
        return;
      }
      var message = undefined;
      var callback = null;
      if (args.length === 0) {
        message = null;
      }
      if (args.length === 1) {
        if ('function' === typeof args[0]) {
          callback = args[0];
        } else {
          message = args[0];
        }
      }
      if (args.length > 1) {
        var sliceTotal = args.length;
        if ('function' === typeof args.length) {
          sliceTotal = sliceTotal - 1;
          callback = args[sliceTotal - 1];
        }
        message = args.slice(0, sliceTotal).join(' ');
      }
      this._messageOut.emit('send', JSON.stringify({ key: event, value: message }));

      if (callback) {
        callback();
      }
    }
  }]);

  return Exchange;
})();

var ShifterbeltClient = (function () {
  /**
   *
   * @param {{}} options
   */

  function ShifterbeltClient(options) {
    var _this = this;

    _classCallCheck(this, ShifterbeltClient);

    this._messageInternalOut = new _events2['default'].EventEmitter();
    this._messageOut = new _events2['default'].EventEmitter();
    this._messageIn = new _events2['default'].EventEmitter();
    this._connected = false;

    // Setted dynamically
    this._masters = {};
    this._managers = {};
    this._slaves = {};

    options = (0, _util._extend)({ url: 'http://www.shifterbelt.com/ns' }, options);

    _getmac2['default'].getMac(function (err, macAddress) {
      options.macAddress = options.macAddress || macAddress; // TODO : Remove: "options.macAddress ||"
      _this.init(options);
    });
  }

  _createClass(ShifterbeltClient, [{
    key: 'init',

    /**
     *
     * @param {{}} options
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
          _this2._connected = true;

          _this2._authenticated();
        });
      });

      this._socket.on('disconnect', function () {
        _this2._connected = false;
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

      this._socket.on('message', function (message) {
        _this3._internalOnMessage(message);
      });

      this._socket.on('service', function (message) {
        _this3._internelOnService(message);
      });

      this._messageOut.addListener('send', function (data) {
        _this3._socket.emit('message', data);
      });

      this._messageInternalOut.emit('connect', new Exchange(this._messageOut, this._messageIn));
    }
  }, {
    key: '_internalOnMessage',

    /**
     *
     * @param {Object} message
     * @private
     */
    value: function _internalOnMessage(message) {
      var chunk = {};

      if (message.hasOwnProperty('content')) {
        var result = JSON.parse(message.content.toString());

        chunk[result['key']] = result['value'];
      } else {
        chunk = message;
      }
      var keys = Object.keys(chunk);
      if (keys.length !== 1) {
        return;
      }
      this._messageIn.emit(keys[0], chunk[keys[0]]);
    }
  }, {
    key: '_internelOnService',

    /**
     *
     * @param {{}} message
     * @private
     */
    value: function _internelOnService(message) {
      new _libAnalyseMessageJs2['default'](message, this).init();
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

//# sourceMappingURL=shiflterbelt-client.js.map
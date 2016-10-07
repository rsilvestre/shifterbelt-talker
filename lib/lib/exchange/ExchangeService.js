/**
 * Created by michaelsilvestre on 14/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _Exchanger2 = require('./Exchanger');

var _Exchanger3 = _interopRequireDefault(_Exchanger2);

var ExchangeService = (function (_Exchanger) {
  function ExchangeService(Exchange, messageOut, messageIn, options) {
    _classCallCheck(this, ExchangeService);

    _get(Object.getPrototypeOf(ExchangeService.prototype), 'constructor', this).call(this, new _events2['default'].EventEmitter(), new _events2['default'].EventEmitter(), options);
    this._messageOutTmp = messageOut;
    this._messageInTmp = messageIn;
    this._Exchange = Exchange;
    return this.init();
  }

  _inherits(ExchangeService, _Exchanger);

  _createClass(ExchangeService, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this._messageInTmp.on('device_connect', function (deviceId) {

        var localMessageOut = new _events2['default'].EventEmitter();
        var localMessageIn = new _events2['default'].EventEmitter();
        _this._messageInTmp.on(deviceId, function (message) {
          localMessageIn.emit(message.key, message.value);
        });

        localMessageOut.on('send', function (message) {
          _this._messageOutTmp.emit('send', deviceId, message);
        });

        var exchange = new _this._Exchange(localMessageOut, localMessageIn, {
          deviceId: deviceId,
          role: _this.role
        });

        _this._messageIn.emit('connect', exchange);

        exchange.isConnected = true;

        _this._messageInTmp.on('device_disconnect|' + deviceId, function (deviceId) {
          localMessageIn.emit('disconnect');
          _this._messageInTmp.removeAllListeners(deviceId);
          _this._messageInTmp.removeAllListeners('device_disconnect|' + deviceId);
          //localMessageOut.removeAllListeners('send');
        });

        _this._messageInTmp.on('disconnect', function (deviceId) {
          localMessageIn.emit('disconnect');
          _this._messageInTmp.removeAllListeners(deviceId);
          _this._messageInTmp.removeAllListeners('device_disconnect|' + deviceId);
        });
      });
    }
  }, {
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

      if (!this.isConnected) {
        return;
      }

      var _get$apply = _get(Object.getPrototypeOf(ExchangeService.prototype), 'emit', this).apply(this, args);

      var message = _get$apply.message;
      var callback = _get$apply.callback;

      this._messageOut.emit('send', JSON.stringify({ key: event, value: message }));

      if (callback) {
        callback();
      }
    }
  }]);

  return ExchangeService;
})(_Exchanger3['default']);

exports['default'] = ExchangeService;
module.exports = exports['default'];
//# sourceMappingURL=ExchangeService.js.map
/**
 * Created by michaelsilvestre on 7/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _ExchangerJs = require('./Exchanger.js');

var _ExchangerJs2 = _interopRequireDefault(_ExchangerJs);

var ExchangeManager = (function (_Exchanger) {
  function ExchangeManager(messageOut, messageIn, options) {
    _classCallCheck(this, ExchangeManager);

    _get(Object.getPrototypeOf(ExchangeManager.prototype), 'constructor', this).call(this, messageOut, messageIn, options);
  }

  _inherits(ExchangeManager, _Exchanger);

  _createClass(ExchangeManager, [{
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
      if (!this.isConnected) {
        return;
      }

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _get$apply = _get(Object.getPrototypeOf(ExchangeManager.prototype), 'emit', this).apply(this, args);

      var message = _get$apply.message;
      var callback = _get$apply.callback;

      this._messageOut.emit('send', JSON.stringify({ key: event, value: message }));

      if (callback) {
        callback();
      }
    }
  }]);

  return ExchangeManager;
})(_ExchangerJs2['default']);

exports['default'] = ExchangeManager;
module.exports = exports['default'];
//# sourceMappingURL=ExchangeManager.js.map
/**
 * Created by michaelsilvestre on 7/06/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exchanger = (function () {
  /**
   *
   * @param {events.EventEmitter} messageOut
   * @param {events.EventEmitter} messageIn
   * @param {String} role
   */

  function Exchanger(messageOut, messageIn, role) {
    _classCallCheck(this, Exchanger);

    this._messageOut = messageOut;
    this._messageIn = messageIn;
    this._connected = false;
    this._role = role;
  }

  _createClass(Exchanger, [{
    key: "emit",

    /**
     *
     * @param {Array} args
     * @returns {{message: *, callback: *}}
     */
    value: function emit() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var callback = null;
      var message = null;

      if (args.length === 0) {
        message = null;
      }

      if (args.length === 1) {
        if ("function" === typeof args[0]) {
          callback = args[0];
        } else {
          message = args[0];
        }
      }

      if (args.length > 1) {
        var sliceTotal = args.length;
        if ("function" === typeof args[args.length - 1]) {
          sliceTotal = sliceTotal - 1;
          callback = args[sliceTotal - 1];
        }
        message = args.slice(0, sliceTotal).join(" ");
      }

      return { message: message, callback: callback };
    }
  }, {
    key: "role",

    /**
     *
     * @returns {String|*|Exchanger.role}
     */
    get: function () {
      return this._role;
    }
  }, {
    key: "isConnected",

    /**
     *
     * @param {boolean|Boolean|*} value
     */
    set: function (value) {
      this._connected = value;
    },

    /**
     *
     * @returns {boolean|Boolean|*}
     */
    get: function () {
      return this._connected;
    }
  }]);

  return Exchanger;
})();

exports["default"] = Exchanger;
module.exports = exports["default"];
/**
 * Created by michaelsilvestre on 14/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _exchangeExchangeServiceJs = require('./exchange/ExchangeService.js');

var _exchangeExchangeServiceJs2 = _interopRequireDefault(_exchangeExchangeServiceJs);

var DeviceRole = (function () {
  function DeviceRole(messageOut, messageIn, role) {
    _classCallCheck(this, DeviceRole);

    this._device = new this[role](messageOut, messageIn, role);
    this._device.isConnected = true;
  }

  _createClass(DeviceRole, [{
    key: 'device',
    get: function get() {
      return this._device;
    }
  }, {
    key: 'master',
    get: function get() {
      return DeviceRoleMasterType;
    }
  }, {
    key: 'manager',
    get: function get() {
      return DeviceRoleMasterType;
    }
  }, {
    key: 'slave',
    get: function get() {
      return DeviceRoleSlaveType;
    }
  }]);

  return DeviceRole;
})();

exports['default'] = DeviceRole;

var DeviceRoler = (function () {
  /**
   *
   * @param {String} role
   */

  function DeviceRoler(role) {
    _classCallCheck(this, DeviceRoler);

    this._isConnected = false;
    this._role = role;
    this._Exchange = require('./exchange/Exchange' + role.charAt(0).toUpperCase() + role.substring(1).toLowerCase() + '.js');
  }

  _createClass(DeviceRoler, [{
    key: 'isConnected',

    /**
     *
     * @returns {boolean|Boolean}
     */
    get: function get() {
      return this._isConnected;
    },

    /**
     *
     * @param {boolean|Boolean} value
     */
    set: function set(value) {
      this._isConnected = value;
    }
  }, {
    key: 'role',

    /**
     *
     * @returns {String|*|Exchanger.role}
     */
    get: function get() {
      return this._role;
    }
  }]);

  return DeviceRoler;
})();

var DeviceRoleMasterType = (function (_DeviceRoler) {
  function DeviceRoleMasterType(messageOut, messageIn, role) {
    _classCallCheck(this, DeviceRoleMasterType);

    _get(Object.getPrototypeOf(DeviceRoleMasterType.prototype), 'constructor', this).call(this, role);
    this._messageOut = messageOut;
    this._messageIn = messageIn;
    return this._init();
  }

  _inherits(DeviceRoleMasterType, _DeviceRoler);

  _createClass(DeviceRoleMasterType, [{
    key: '_init',
    value: function _init() {
      //return new this._Exchange(this._messageOut, this._messageIn, this.role);
      return new _exchangeExchangeServiceJs2['default'](this._Exchange, this._messageOut, this._messageIn, { role: this.role });
    }
  }]);

  return DeviceRoleMasterType;
})(DeviceRoler);

var DeviceRoleSlaveType = (function (_DeviceRoler2) {
  function DeviceRoleSlaveType(messageOut, messageIn, role) {
    _classCallCheck(this, DeviceRoleSlaveType);

    _get(Object.getPrototypeOf(DeviceRoleSlaveType.prototype), 'constructor', this).call(this, role);
    return new this._Exchange(messageOut, messageIn, { role: this.role });
  }

  _inherits(DeviceRoleSlaveType, _DeviceRoler2);

  return DeviceRoleSlaveType;
})(DeviceRoler);

module.exports = exports['default'];
//# sourceMappingURL=DeviceRole.js.map
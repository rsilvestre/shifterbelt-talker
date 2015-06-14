/**
 * Created by michaelsilvestre on 14/06/15
 */

import ExchangeService from './exchange/ExchangeService.js'

export default class DeviceRole {
  constructor(messageOut, messageIn, role) {
    this._device = new this[role](messageOut, messageIn, role);
    this._device.isConnected = true;
  }

  get device() {
    return this._device;
  }

  get master() {
    return DeviceRoleMasterType;
  }

  get manager() {
    return DeviceRoleMasterType;
  }

  get slave() {
    return DeviceRoleSlaveType;
  }
}

class DeviceRoler {
  /**
   *
   * @param {String} role
   */
  constructor(role) {
    this._isConnected = false;
    this._role = role;
    this._Exchange = require(`./exchange/Exchange${role.charAt(0).toUpperCase()}${role.substring(1).toLowerCase()}.js`);
  }

  /**
   *
   * @returns {boolean|Boolean}
   */
  get isConnected() {
    return this._isConnected;
  }

  /**
   *
   * @param {boolean|Boolean} value
   */
  set isConnected(value) {
    this._isConnected = value;
  }

  /**
   *
   * @returns {String|*|Exchanger.role}
   */
  get role() {
    return this._role;
  }
}

class DeviceRoleMasterType extends DeviceRoler {
  constructor(messageOut, messageIn, role) {
    super(role);
    this._messageOut = messageOut;
    this._messageIn = messageIn;
    return this._init();
  }

  _init() {
    //return new this._Exchange(this._messageOut, this._messageIn, this.role);
    return new ExchangeService(this._Exchange, this._messageOut, this._messageIn, { role: this.role });
  }
}

class DeviceRoleSlaveType extends DeviceRoler {
  constructor(messageOut, messageIn, role) {
    super(role);
    return new this._Exchange(messageOut, messageIn, { role: this.role });
  }
}
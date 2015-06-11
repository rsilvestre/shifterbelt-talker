/**
 * Created by michaelsilvestre on 7/06/15
 */

export default class Exchanger {
  /**
   *
   * @param {events.EventEmitter} messageOut
   * @param {events.EventEmitter} messageIn
   * @param {String} role
   */
  constructor(messageOut, messageIn, role) {
    this._messageOut = messageOut;
    this._messageIn = messageIn;
    this._connected = false;
    this._role = role;
  }

  /**
   *
   * @param {Array} args
   * @returns {{message: *, callback: *}}
   */
  emit(...args) {

    let callback = null;
    let message = null;

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
      let sliceTotal = args.length;
      if ("function" === typeof args[args.length - 1]) {
        sliceTotal = sliceTotal - 1;
        callback = args[sliceTotal - 1];
      }
      message = args.slice(0, sliceTotal).join(" ");
    }

    return { message: message, callback: callback };
  }

  /**
   *
   * @returns {String|*|Exchanger.role}
   */
  get role() {
    return this._role;
  }

  /**
   *
   * @param {boolean|Boolean} value
   */
  set isConnected(value) {
    this._connected = value;
  }

  /**
   *
   * @returns {boolean|Boolean}
   */
  get isConnected() {
    return this._connected;
  }

}
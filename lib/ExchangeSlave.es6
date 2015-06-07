/**
 * Created by michaelsilvestre on 7/06/15
 */

import Exchanger from './Exchanger.js'

export default class ExchangeSlave extends Exchanger {
  constructor(messageOut, messageIn, role) {
    super(messageOut, messageIn, role);
  }

  /**
   *
   * @param {String} event
   * @param {Function} callback
   */
  on(event, callback) {
    this._messageIn.addListener(event, callback);
  }

  /**
   *
   * @param {String} event
   * @param {Arguments} args
   */
  emit(event, ...args) {
    if (!this.isConnected) {
      return;
    }

    let { message: message, callback: callback } = super.emit(...args);

    this._messageOut.emit('send', JSON.stringify({ key: event, value: message }));

    if (callback) {
      callback();
    }
  }
}

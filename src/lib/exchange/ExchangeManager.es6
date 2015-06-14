/**
 * Created by michaelsilvestre on 7/06/15
 */

import Exchanger from './Exchanger.js'

export default class ExchangeManager extends Exchanger {
  constructor(messageOut, messageIn, options) {
    super(messageOut, messageIn, options);
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

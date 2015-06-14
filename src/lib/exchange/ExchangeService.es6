/**
 * Created by michaelsilvestre on 14/06/15
 */

import events from "events"
import Exchanger from './Exchanger'

export default class ExchangeService extends Exchanger {
  constructor(Exchange, messageOut, messageIn, options) {
    super(new events.EventEmitter(), new events.EventEmitter(), options);
    this._messageOutTmp = messageOut;
    this._messageInTmp = messageIn;
    this._Exchange = Exchange;
    return this.init();
  }

  init() {
    this._messageInTmp.on('device_connected', (deviceId)=> {
      let localMessageOut = new events.EventEmitter();
      let localMessageIn = new events.EventEmitter();
      this._messageInTmp.on(deviceId, (message) => {
        localMessageIn.emit(message.key, message.value);
      });
      localMessageOut.on('send', (message) => {
        this._messageOutTmp.emit('send', deviceId, message);
      });
      let exchange = new this._Exchange(localMessageOut, localMessageIn, {
        deviceId: deviceId,
        role: this.role
      });
      this._messageIn.emit('connect', exchange);
      exchange.isConnected = true;
      this._messageInTmp.on('device_disconnected', (deviceId) => {
        localMessageIn.emit('disconnect');
        exchange = null;
        //localMessageIn = null;
        //localMessageOut = null;
      });
    });
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

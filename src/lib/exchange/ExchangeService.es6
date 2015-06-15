/**
 * Created by michaelsilvestre on 14/06/15
 */

import events from "events"
import Exchanger from './Exchanger'

class ArrayKniffe extends Array {
  constructor() {
    super();
  }

  /**
   * check if an element exists in array using a comparer function
   * comparer : function(currentElement)
   *
   * @param comparer
   * @returns {boolean}
   */
  inArray(comparer) {
    for (var i = 0; i < this.length; i++) {
      if (comparer(this[i])) return true;
    }
    return false;
  }

  /**
   * adds an element to the array if it does not already exist using a comparer
   *
   * @param element
   * @param comparer
   */
  pushIfNotExist(element, comparer) {
    if (!this.inArray(comparer)) {
      this.push(element);
    }
  }

}

export default class ExchangeService extends Exchanger {
  constructor(Exchange, messageOut, messageIn, options) {
    super(new events.EventEmitter(), new events.EventEmitter(), options);
    this._messageOutTmp = messageOut;
    this._messageInTmp = messageIn;
    this._Exchange = Exchange;
    return this.init();
  }

  init() {
    this._messageInTmp.on('device_connect', (deviceId)=> {
      let deviceList = new ArrayKniffe();

      let localMessageOut = new events.EventEmitter();
      let localMessageIn = new events.EventEmitter();

      let cleanEvent = () => {
        this._messageInTmp.removeAllListeners('device_connect');
        deviceList.forEach((id) => {
          localMessageIn.removeAllListeners(id);
        });
        localMessageOut.removeAllListeners('send');
        this._messageInTmp.removeAllListeners('device_disconnect');
        this._messageInTmp.removeAllListeners('device_connect');
        //localMessageIn = null;
        //localMessageOut = null;
      };

      this._messageInTmp.on(deviceId, (message) => {
        deviceList.pushIfNotExist(deviceId);
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

      this._messageInTmp.on('device_disconnect', (deviceId) => {
        //cleanEvent();
        localMessageIn.emit('disconnect');
        exchange = null;
      });

      this._messageInTmp.on('disconnect', (deviceId) => {
        localMessageIn.emit('disconnect');
        //cleanEvent();
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


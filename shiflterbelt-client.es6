/**
 * Created by michaelsilvestre on 25/04/15
 */

import events from "events"
import socketClient from 'socket.io-client'
import getmac from 'getmac'
import ValidateOptions from './lib/ValidateOptions.js'
import AnalyseMessage from './lib/AnalyseMessage.js'
import { _extend } from 'util'

class Exchange {
  constructor(messageOut, messageIn) {
    this._messageOut = messageOut;
    this._messageIn = messageIn;
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
    if (!this._connected) {
      return;
    }
    let message;
    let callback = null;
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
      if ("function" === typeof args.length) {
        sliceTotal = sliceTotal - 1;
        callback = args[sliceTotal - 1];
      }
      message = args.slice(0, sliceTotal).join(" ");
    }
    this._messageOut.emit('send', JSON.stringify({ key: event, value: message }));

    if (callback) {
      callback();
    }
  }
}

export default class ShifterbeltClient {
  /**
   *
   * @param {{}} options
   */
  constructor(options) {
    this._messageInternalOut = new events.EventEmitter();
    this._messageOut = new events.EventEmitter();
    this._messageIn = new events.EventEmitter();
    this._connected = false;

    // Setted dynamically
    this._masters = {};
    this._managers = {};
    this._slaves = {};

    options = _extend({url: "http://www.shifterbelt.com/ns"}, options);

    getmac.getMac((err, macAddress) => {
      options.macAddress = options.macAddress || macAddress; // TODO : Remove: "options.macAddress ||"
      this.init(options);
    });
  }

  /**
   *
   * @param {{}} options
   */
  init(options) {

    let valide = (new ValidateOptions(options)).execute();

    if (valide.err) {
      return console.log(valide.err.message);
    }

    this._socket = socketClient(valide.result.url, { query: valide.result.options });

    this._socket.on('connect', () => {
      this._socket.on('error_system', (message) => {
        this._messageInternalOut.emit('error_system', message);
      });

      this._socket.emit('authenticate', JSON.stringify(valide.result.raw));

      this._socket.on('authenticated', () => {
        this._connected = true;

        this._authenticated();
      });
    });

    this._socket.on('disconnect', () => {
      this._connected = false;
    });
  }

  /**
   *
   * @private
   */
  _authenticated() {
    this._socket.on('message', (message) => {
      this._internalOnMessage(message);
    });

    this._socket.on('service', (message) => {
      this._internelOnService(message);
    });

    this._messageOut.addListener('send', (data) => {
      this._socket.emit('message', data);
    });

    this._messageInternalOut.emit('connect', new Exchange(this._messageOut, this._messageIn));
  }

  /**
   *
   * @param {Object} message
   * @private
   */
  _internalOnMessage(message) {
    let chunk = {};

    if (message.hasOwnProperty('content')) {
      let result = JSON.parse(message.content.toString());

      chunk[result['key']] = result['value'];
    } else {
      chunk = message;
    }
    var keys = Object.keys(chunk);
    if (keys.length !== 1) {
      return;
    }
    this._messageIn.emit(keys[0], chunk[keys[0]]);
  }

  /**
   *
   * @param {{}} message
   * @private
   */
  _internelOnService(message) {
    (new AnalyseMessage(message, this)).init();
  }

  /**
   *
   * @param {String} event
   * @param {Function} callback
   */
  on(event, callback) {
    this._messageInternalOut.addListener(event, callback);
  }

}
/**
 * Created by michaelsilvestre on 25/04/15
 */

import events from "events"
import socketClient from 'socket.io-client'
import getmac from 'getmac'
import ValidateOptions from './lib/ValidateOptions.js'
import AnalyseMessage from './lib/AnalyseMessage.js'
import { _extend } from 'util'


export default class ShifterbeltClient {
  /**
   *
   * @param {Object} options
   */
  constructor(options) {
    this._messageInternalOut = new events.EventEmitter();
    this._messageOut = new events.EventEmitter();
    this._messageIn = new events.EventEmitter();

    this._analyseMessage = {};
    this._exchange = {};

    // Setted dynamically
    this._masters = {};
    this._managers = {};
    this._slaves = {};

    options = _extend({ url: "http://socket.shifterbelt.com/ns" }, options);

    getmac.getMac((err, macAddress) => {
      options.macAddress = options.macAddress || macAddress; // TODO : Remove: "options.macAddress ||"
      this.init(options);
    });
  }

  /**
   *
   * @param {Object} options
   */
  init(options) {

    let valide = (new ValidateOptions(options)).execute();

    if (valide.err) {
      return console.log(valide.err.message);
    }

    this._socket = socketClient(valide.result.url, { query: valide.result.options });

    this._socket.on('connect', () => {
      this._socket.on('error_system', (message) => {
        this._messageInternalOut.emit('error', message);
      });

      this._socket.emit('authenticate', JSON.stringify(valide.result.raw));

      this._socket.on('authenticated', () => {
        this._authenticated();
      });
    });

    this._socket.on('disconnect', () => {
      this._exchange.isConnected = false;
    });
  }

  /**
   *
   * @private
   */
  _authenticated() {
    this._analyseMessage = new AnalyseMessage(this, (role) => {
      let Exchange = require(`./lib/Exchange${role.charAt(0).toUpperCase()}${role.substring(1).toLowerCase()}.js`);

      this._exchange = new Exchange(this._messageOut, this._messageIn, role);
      this._exchange.isConnected = true;

      this._messageInternalOut.emit('connect', this._exchange);
    });

    this._socket.on('message', (message) => {
      this._internalOnMessage(message);
    });

    this._socket.on('service', (message) => {
      this._internelOnService(message);
    });

    this._messageOut.addListener('send', (...data) => {
      if (data.length === 1) {
        return this._socket.emit('message', data[0]);
      }

      this._socket.emit('message', JSON.stringify({
        key: data[0],
        message: data[1]
      }));

    });

  }

  /**
   *
   * @param {Object} message
   * @private
   */
  _internalOnMessage(message) {

    if (message.hasOwnProperty('content')) {
      let result = JSON.parse(message.content.toString());

      if (result.hasOwnProperty('slaveId')) {
        return this._messageIn.emit(result['key'], result['slaveId'], result['value']);
      } else {
        return this._messageIn.emit(result['key'], result['value']);
      }
    }

    var keys = Object.keys(message);
    if (keys.length !== 1) {
      return;
    }
    this._messageIn.emit(keys[0], message[keys[0]]);
  }

  /**
   *
   * @param {{}} message
   * @private
   */
  _internelOnService(message) {
    this._analyseMessage.execute(message);
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
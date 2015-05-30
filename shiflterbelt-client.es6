/**
 * Created by michaelsilvestre on 25/04/15
 */

import events from "events"
import socketClient from 'socket.io-client'
import validUrl from 'valid-url'
import getmac from 'getmac'
import { _extend } from 'util'

function validateOption(options) {
  let extras = {
    mac_address: (value) => {
      return getmac.isMac(value);
    }
  };

  let optionSchema = {
    url: { type: "string" },
    applicationId: { type: "number" },
    key: { type: "string", len: 40 },
    password: { type: "string", len: 80 },
    macAddress: { type: "string", len: 17, extra: ["mac_address"] }
  };

  let valide = (key, value) => {
    if (!optionSchema.hasOwnProperty(key)) {
      return new Error(`The option: ${key}, not exist`);
    }
    if (typeof(value) !== optionSchema[key].type) {
      return new Error(`The type of: ${key}, is not ${optionSchema[key].type}`);
    }
    if (optionSchema[key].hasOwnProperty('len') && value.length !== optionSchema[key].len) {
      return new Error(`The length of: ${key}, is not equal to ${optionSchema[key].len}`);
    }
    if (optionSchema[key].hasOwnProperty('extras')) {
      let result = optionSchema[key]['extras'].filter((extra) => {
        return !extras[extra](value)
      });
      if (result > 0) {
        return new Error(`There is an error in the extras values ${result}`);
      }
    }
    return value;
  };

  let result = {};
  if (typeof(options) === 'string') {
    result = { err: null, result: { url: options, options: {} } };
  }

  if (typeof(options) === 'object') {
    let url = "";
    let option = {};

    if (!options.hasOwnProperty('url')) {
      return new Error('No url found');
    }
    let optionValues = Object.keys(options).map((value) => {
      return valide(value, options[value]);
    });
    let optionValidate = optionValues.filter((value) => {
      return (value instanceof Error) || value === ""
    });
    if (optionValidate.length > 0) {
      let errors = optionValidate.map((value) => {
        return value.message
      }).join(', ');
      return { err: new Error(`Error in options: ${errors}`), result: null };
    }
    url = options.url;
    delete options.url;
    option = Object.keys(options).map((value) => {
      return `${value}=${options[value]}`;
    }).join('&');

    result = { err: null, result: { url: url, options: option, raw: options } };
  }

  if (!validUrl.is_uri(result.result.url)) {
    return { err: new Error(`The URL: ${result.result.url}, is not valid`), result: null };
  }

  return result;

}

class AnalyseContentRemove {
  constructor(content, context) {
    this._content = content;
    this._context = context;
  }

  master() {
    let listName = `_${this._content['role']}s`;
    if (!this._context.hasOwnProperty(listName)) {
      return;
    }
    console.log('goodbye message: ' + "goodbye slave: " + this._content['id']);
    delete(this._context[listName][this._content['id']]);
  }

  init() {
    try {
      this[this._context['role']]();
    } catch (e) {
      console.warn(e);
    }
  }
}

class AnalyseContentAdd {
  constructor(content, context) {
    this._content = content;
    this._context = context;
  }

  master() {
    let listName = `_${this._content['role']}s`;
    if (!this._context.hasOwnProperty(listName)) {
      return;
    }
    console.log('welcome message: ' + "hello slave: " + this._content['id']);
    this._context[listName][this._content['id']] = this._content;
    this._context._socket.emit('message', JSON.stringify({
      key: this._content['id'],
      message: JSON.stringify({ key: 'event', value: "Welcome slave: " + this._content['id'] })
    }));
  }

  init() {
    try {
      this[this._context['role']]();
    } catch (e) {
      console.warn(e);
    }
  }
}

class AnalyseMessage {
  constructor(message, context) {
    this._message = message;
    this._context = context;
  }

  identification(content) {
    _extend(this._context, content);
  }

  connection(content) {
    let analyseContent = new AnalyseContentAdd(content, this._context);
    analyseContent.init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  slaveList(contents) {
    contents.forEach((content) => {
      (new AnalyseContentAdd(content, this._context)).init();
    });
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  slaveDisconnected(content) {
    let analyseContent = new AnalyseContentRemove(content, this._context);
    analyseContent.init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  init() {
    try {
      this[this._message['action']](this._message['content']);
    } catch (e) {
      console.warn(e);
    }
  }
}

export default class ShifterbeltClient {
  constructor(options) {
    this._obj1 = new events.EventEmitter();
    this._obj2 = new events.EventEmitter();
    this._connected = false;
    this._masters = {};
    this._managers = {};
    this._slaves = {};
    getmac.getMac((err, macAddress) => {
      options.macAddress = options.macAddress || macAddress; // TODO : Remove: "options.macAddress ||"
      this.init(options);
    });
  }

  init(options) {

    let valide = validateOption(options);

    if (valide.err) {
      return console.log(valide.err.message);
    }

    this._socket = socketClient(valide.result.url, { query: valide.result.options });

    this._socket.on('connect', () => {
      //this._obj1.emit('connect');
      this._socket.emit('authenticate', JSON.stringify(valide.result.raw));
      this._socket.on('authenticated', () => {
        this._connected = true;
        this._socket.on('message', (message) => {
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
          this._obj1.emit(keys[0], chunk[keys[0]]);
        });
        this._socket.on('service', (message) => {
          let analyseMessage = new AnalyseMessage(message, this);
          analyseMessage.init();
        });
        this._obj2.addListener('send', (data) => {
          /*
           let jsonObj = JSON.parse(data);

           if (!jsonObj.value) {
           this._socket.emit(jsonObj.key);
           return;
           }
           this._socket.emit(jsonObj.key, jsonObj.value);
           */
          this._socket.emit('message', data);
        });
        this._obj1.emit('connect');
      });
    });

    this._socket.on('disconnect', () => {
      this._connected = false;
    });
  }


  on(event, callback) {
    this._obj1.addListener(event, callback);
  }

  get error() {
    return this._error;
  }

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
    this._obj2.emit('send', JSON.stringify({ key: event, value: message }));

    if (callback) {
      callback();
    }
  }

}
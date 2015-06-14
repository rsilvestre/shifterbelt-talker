/**
 * Created by michaelsilvestre on 7/06/15
 */

import Analyser from './Analyser.js'

export default class AnalyseContentAdd extends Analyser {
  constructor(content, context) {
    super(content, context);
  }

  _master() {
    let listName = `_${this._content['role']}s`;
    if (!this._context.hasOwnProperty(listName)) {
      return;
    }
    console.log('send: welcome message: ' + "hello slave: " + this._content['id']);
    this._context[listName][this._content['id']] = this._content;
    this._context._socket.emit('message', JSON.stringify({
      key: this._content['id'],
      message: JSON.stringify({ key: 'event', value: "Welcome slave: " + this._content['id'] })
    }));
    this._context._messageIn.emit('device_connected', this._content.id);
  }
}


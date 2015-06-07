/**
 * Created by michaelsilvestre on 7/06/15
 */

import AnalyseContentAdd from './AnalyseContentAdd.js'
import AnalyseContentRemove from './AnalyserContentRemove.js'
import { _extend } from 'util'

export default class AnalyseMessage {
  constructor(message, context) {
    this._message = message;
    this._context = context;
  }

  _identification(content) {
    _extend(this._context, content);
  }

  _connection(content) {
    let analyseContent = new AnalyseContentAdd(content, this._context);
    analyseContent.init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  _slaveList(contents) {
    contents.forEach((content) => {
      (new AnalyseContentAdd(content, this._context)).init();
    });
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  _slaveDisconnected(content) {
    let analyseContent = new AnalyseContentRemove(content, this._context);
    analyseContent.init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  init() {
    try {
      this[`_this._message['action']`](this._message['content']);
    } catch (e) {
      console.warn(e);
    }
  }
}



/**
 * Created by michaelsilvestre on 7/06/15
 */

import AnalyseContentAdd from './AnalyseContentAdd.js'
import AnalyseContentRemove from './AnalyserContentRemove.js'
import { _extend } from 'util'

export default class AnalyseMessage {
  constructor(context, cb) {
    this._context = context;
    this._connectCb = cb;
  }

  _identification(content) {
    _extend(this._context, content);
    this._connectCb(this._context['role']);
  }

  _connection(content) {
    (new AnalyseContentAdd(content, this._context)).init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  _slaveList(contents) {
    contents.forEach((content) => {
      (new AnalyseContentAdd(content, this._context)).init();
    });
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  _slaveDisconnected(content) {
    (new AnalyseContentRemove(content, this._context)).init();
    console.log(this._context._slaves); // TODO: Can be deleted
  }

  execute(message) {
    try {
      this[`_${message['action']}`](message['content']);
    } catch (e) {
      console.warn(e);
    }
  }
}



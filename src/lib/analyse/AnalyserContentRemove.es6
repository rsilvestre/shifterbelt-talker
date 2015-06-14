/**
 * Created by michaelsilvestre on 7/06/15
 */

import Analyser from './Analyser.js'

export default class AnalyseContentRemove extends Analyser {
  constructor(content, context) {
    super(content, context);
  }

  _master() {
    let listName = `_${this._content['role']}s`;
    if (!this._context.hasOwnProperty(listName)) {
      return;
    }
    console.log('goodbye message: ' + "goodbye slave: " + this._content.id);
    delete(this._context[listName][this._content.id]);
    this._context._messageIn.emit('device_disconnected', this._content.id);
  }

}


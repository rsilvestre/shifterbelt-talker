/**
 * Created by michaelsilvestre on 7/06/15
 */


export default class Analyser {
  constructor(content, context) {
    this._content = content;
    this._context = context;
  }

  init() {
    try {
      this[`_${this._context['role']}`]();
    } catch (e) {
      console.warn(e);
    }
  }
}


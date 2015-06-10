/**
 * Created by michaelsilvestre on 7/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Analyser = (function () {
  function Analyser(content, context) {
    _classCallCheck(this, Analyser);

    this._content = content;
    this._context = context;
  }

  _createClass(Analyser, [{
    key: 'init',
    value: function init() {
      try {
        this['_' + this._context['role']]();
      } catch (e) {
        console.warn(e);
      }
    }
  }]);

  return Analyser;
})();

exports['default'] = Analyser;
module.exports = exports['default'];
//# sourceMappingURL=Analyser.js.map
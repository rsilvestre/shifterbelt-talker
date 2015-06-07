/**
 * Created by michaelsilvestre on 7/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _AnalyserJs = require('./Analyser.js');

var _AnalyserJs2 = _interopRequireDefault(_AnalyserJs);

var AnalyseContentAdd = (function (_Analyser) {
  function AnalyseContentAdd(content, context) {
    _classCallCheck(this, AnalyseContentAdd);

    _get(Object.getPrototypeOf(AnalyseContentAdd.prototype), 'constructor', this).call(this, content, context);
  }

  _inherits(AnalyseContentAdd, _Analyser);

  _createClass(AnalyseContentAdd, [{
    key: '_master',
    value: function _master() {
      var listName = '_' + this._content['role'] + 's';
      if (!this._context.hasOwnProperty(listName)) {
        return;
      }
      console.log('welcome message: ' + 'hello slave: ' + this._content['id']);
      this._context[listName][this._content['id']] = this._content;
      this._context._socket.emit('message', JSON.stringify({
        key: this._content['id'],
        message: JSON.stringify({ key: 'event', value: 'Welcome slave: ' + this._content['id'] })
      }));
    }
  }]);

  return AnalyseContentAdd;
})(_AnalyserJs2['default']);

exports['default'] = AnalyseContentAdd;
module.exports = exports['default'];

//# sourceMappingURL=AnalyseContentAdd.js.map
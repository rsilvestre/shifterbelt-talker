/**
 * Created by michaelsilvestre on 7/06/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AnalyseContentAddJs = require('./AnalyseContentAdd.js');

var _AnalyseContentAddJs2 = _interopRequireDefault(_AnalyseContentAddJs);

var _AnalyserContentRemoveJs = require('./AnalyserContentRemove.js');

var _AnalyserContentRemoveJs2 = _interopRequireDefault(_AnalyserContentRemoveJs);

var _util = require('util');

var AnalyseMessage = (function () {
  function AnalyseMessage(context, cb) {
    _classCallCheck(this, AnalyseMessage);

    this._context = context;
    this._connectCb = cb;
  }

  _createClass(AnalyseMessage, [{
    key: '_identification',
    value: function _identification(content) {
      (0, _util._extend)(this._context, content);
      this._connectCb(this._context['role']);
    }
  }, {
    key: '_connection',
    value: function _connection(content) {
      new _AnalyseContentAddJs2['default'](content, this._context).init();
      console.log(this._context._slaves); // TODO: Can be deleted
    }
  }, {
    key: '_slaveList',
    value: function _slaveList(contents) {
      var _this = this;

      contents.forEach(function (content) {
        new _AnalyseContentAddJs2['default'](content, _this._context).init();
      });
      console.log(this._context._slaves); // TODO: Can be deleted
    }
  }, {
    key: '_slaveDisconnected',
    value: function _slaveDisconnected(content) {
      new _AnalyserContentRemoveJs2['default'](content, this._context).init();
      console.log(this._context._slaves); // TODO: Can be deleted
    }
  }, {
    key: 'execute',
    value: function execute(message) {
      try {
        this['_' + message['action']](message['content']);
      } catch (e) {
        console.warn(e);
      }
    }
  }]);

  return AnalyseMessage;
})();

exports['default'] = AnalyseMessage;
module.exports = exports['default'];
//# sourceMappingURL=AnalyseMessage.js.map
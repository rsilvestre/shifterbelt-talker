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

var _validUrl = require('valid-url');

var _validUrl2 = _interopRequireDefault(_validUrl);

var _getmac = require('getmac');

var _getmac2 = _interopRequireDefault(_getmac);

var ValidateOptions = (function () {
  function ValidateOptions(options) {
    _classCallCheck(this, ValidateOptions);

    this._options = options;
  }

  _createClass(ValidateOptions, [{
    key: 'extras',
    get: function () {
      return {
        isMacAddress: function isMacAddress(value) {
          return _getmac2['default'].isMac(value);
        }
      };
    }
  }, {
    key: 'optionSchema',
    get: function () {
      return {
        url: { type: 'string' },
        applicationId: { type: 'number' },
        key: { type: 'string', len: 40 },
        password: { type: 'string', len: 80 },
        macAddress: { type: 'string', len: 17, extras: ['isMacAddress'] }
      };
    }
  }, {
    key: 'valide',
    value: function valide(key, value) {
      var _this = this;

      if (!this.optionSchema.hasOwnProperty(key)) {
        return new Error('The option: ' + key + ', not exist');
      }
      if (typeof value !== this.optionSchema[key].type) {
        return new Error('The type of: ' + key + ', is not ' + this.optionSchema[key].type);
      }
      if (this.optionSchema[key].hasOwnProperty('len') && value.length !== this.optionSchema[key].len) {
        return new Error('The length of: ' + key + ', is not equal to ' + this.optionSchema[key].len);
      }
      if (this.optionSchema[key].hasOwnProperty('extras')) {
        var result = this.optionSchema[key]['extras'].filter(function (extra) {
          return !_this.extras[extra](value);
        });
        if (result > 0) {
          return new Error('There is an error in the extras values ' + result);
        }
      }
      return value;
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      var result = {};
      if (typeof this._options === 'string') {
        result = { err: null, result: { url: this._options, options: {} } };
      }

      if (typeof this._options === 'object') {
        if (!this._options.hasOwnProperty('url')) {
          return new Error('No url found');
        }
        var optionValues = Object.keys(this._options).map(function (value) {
          return _this2.valide(value, _this2._options[value]);
        });
        var optionValidate = optionValues.filter(function (value) {
          return value instanceof Error || value === '';
        });
        if (optionValidate.length > 0) {
          var errors = optionValidate.map(function (value) {
            return value.message;
          }).join(', ');
          return { err: new Error('Error in options: ' + errors), result: null };
        }
        var url = this._options.url;
        delete this._options.url;
        var option = Object.keys(this._options).map(function (value) {
          return '' + value + '=' + _this2._options[value];
        }).join('&');

        result = { err: null, result: { url: url, options: option, raw: this._options } };
      }

      if (!_validUrl2['default'].is_uri(result.result.url)) {
        return { err: new Error('The URL: ' + result.result.url + ', is not valid'), result: null };
      }

      return result;
    }
  }]);

  return ValidateOptions;
})();

exports['default'] = ValidateOptions;
module.exports = exports['default'];

//# sourceMappingURL=ValidateOptions.js.map
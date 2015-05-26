/**
 * Created by michaelsilvestre on 25/04/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var _validUrl = require('valid-url');

var _validUrl2 = _interopRequireDefault(_validUrl);

var _getmac = require('getmac');

var _getmac2 = _interopRequireDefault(_getmac);

function validateOption(options) {
    var extras = {
        mac_address: function mac_address(value) {
            return _getmac2['default'].isMac(value);
        }
    };

    var optionSchema = {
        url: { type: 'string' },
        applicationId: { type: 'number' },
        key: { type: 'string', len: 40 },
        password: { type: 'string', len: 80 },
        macAddress: { type: 'string', len: 17, extra: ['mac_address'] }
    };

    var valide = function valide(key, value) {
        if (!optionSchema.hasOwnProperty(key)) {
            return new Error('The option: ' + key + ', not exist');
        }
        if (typeof value !== optionSchema[key].type) {
            return new Error('The type of: ' + key + ', is not ' + optionSchema[key].type);
        }
        if (optionSchema[key].hasOwnProperty('len') && value.length !== optionSchema[key].len) {
            return new Error('The length of: ' + key + ', is not equal to ' + optionSchema[key].len);
        }
        if (optionSchema[key].hasOwnProperty('extras')) {
            var _result = optionSchema[key]['extras'].filter(function (extra) {
                return !extras[extra](value);
            });
            if (_result > 0) {
                return new Error('There is an error in the extras values ' + _result);
            }
        }
        return value;
    };

    var result = {};
    if (typeof options === 'string') {
        result = { err: null, result: { url: options, options: {} } };
    }

    if (typeof options === 'object') {
        var url = '';
        var option = {};

        if (!options.hasOwnProperty('url')) {
            return new Error('No url found');
        }
        var optionValues = Object.keys(options).map(function (value) {
            return valide(value, options[value]);
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
        url = options.url;
        delete options.url;
        option = Object.keys(options).map(function (value) {
            return '' + value + '=' + options[value];
        }).join('&');

        result = { err: null, result: { url: url, options: option, raw: options } };
    }

    if (!_validUrl2['default'].is_uri(result.result.url)) {
        return { err: new Error('The URL: ' + result.result.url + ', is not valid'), result: null };
    }

    return result;
}

var ShifterbeltClient = (function () {
    function ShifterbeltClient(options) {
        var _this = this;

        _classCallCheck(this, ShifterbeltClient);

        this._obj1 = new _events2['default'].EventEmitter();
        this._obj2 = new _events2['default'].EventEmitter();
        this._connected = false;
        _getmac2['default'].getMac(function (err, macAddress) {
            options.macAddress = macAddress;
            _this.init(options);
        });
    }

    _createClass(ShifterbeltClient, [{
        key: 'init',
        value: function init(options) {
            var _this2 = this;

            var valide = validateOption(options);

            if (valide.err) {
                return console.log(valide.err.message);
            }

            this._socket = (0, _socketIoClient2['default'])(valide.result.url, { query: valide.result.options });

            this._socket.on('connect', function () {
                //this._obj1.emit('connect');
                _this2._socket.emit('authenticate', JSON.stringify(valide.result.raw));
                _this2._socket.on('authenticated', function () {
                    _this2._connected = true;
                    _this2._socket.on('message', function (message) {
                        var chunk = {};
                        if (message.hasOwnProperty('content')) {
                            var result = JSON.parse(message.content.toString());
                            chunk[result['key']] = JSON.parse(result['value']);
                        } else {
                            chunk = message;
                        }
                        var keys = Object.keys(chunk);
                        if (keys.length !== 1) {
                            return;
                        }
                        _this2._obj1.emit(keys[0], chunk[keys[0]]);
                    });
                    _this2._obj2.addListener('send', function (data) {
                        /*
                        let jsonObj = JSON.parse(data);
                         if (!jsonObj.value) {
                            this._socket.emit(jsonObj.key);
                            return;
                        }
                        this._socket.emit(jsonObj.key, jsonObj.value);
                        */
                        _this2._socket.emit('message', data);
                    });
                    _this2._obj1.emit('connect');
                });
            });

            this._socket.on('disconnect', function () {
                _this2._connected = false;
            });
        }
    }, {
        key: 'on',
        value: function on(event, callback) {
            this._obj1.addListener(event, callback);
        }
    }, {
        key: 'error',
        get: function () {
            return this._error;
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (!this._connected) {
                return;
            }
            var message = undefined;
            var callback = null;
            if (args.length === 0) {
                message = null;
            }
            if (args.length === 1) {
                if ('function' === typeof args[0]) {
                    callback = args[0];
                } else {
                    message = args[0];
                }
            }
            if (args.length > 1) {
                var sliceTotal = args.length;
                if ('function' === typeof args.length) {
                    sliceTotal = sliceTotal - 1;
                    callback = args[sliceTotal - 1];
                }
                message = args.slice(0, sliceTotal).join(' ');
            }
            this._obj2.emit('send', JSON.stringify({ key: event, value: JSON.stringify(message) }));

            if (callback) {
                callback();
            }
        }
    }]);

    return ShifterbeltClient;
})();

exports['default'] = ShifterbeltClient;
module.exports = exports['default'];

//# sourceMappingURL=shiflterbelt-client.js.map
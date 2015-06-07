/**
 * Created by michaelsilvestre on 7/06/15
 */

import validUrl from 'valid-url'
import getmac from 'getmac'

export default class ValidateOptions {
  constructor(options) {
    this._options = options;
  }

  get extras() {
    return {
      isMacAddress: (value) => {
        return getmac.isMac(value);
      }
    }
  }

  get optionSchema() {
    return {
      url: { type: "string" },
      applicationId: { type: "number" },
      key: { type: "string", len: 40 },
      password: { type: "string", len: 80 },
      macAddress: { type: "string", len: 17, extras: ["isMacAddress"] }
    }
  };

  valide(key, value) {
    if (!this.optionSchema.hasOwnProperty(key)) {
      return new Error(`The option: ${key}, not exist`);
    }
    if (typeof(value) !== this.optionSchema[key].type) {
      return new Error(`The type of: ${key}, is not ${this.optionSchema[key].type}`);
    }
    if (this.optionSchema[key].hasOwnProperty('len') && value.length !== this.optionSchema[key].len) {
      return new Error(`The length of: ${key}, is not equal to ${this.optionSchema[key].len}`);
    }
    if (this.optionSchema[key].hasOwnProperty('extras')) {
      let result = this.optionSchema[key]['extras'].filter((extra) => {
        return !this.extras[extra](value)
      });
      if (result > 0) {
        return new Error(`There is an error in the extras values ${result}`);
      }
    }
    return value;
  };

  execute() {
    let result = {};
    if (typeof(this._options) === 'string') {
      result = { err: null, result: { url: this._options, options: {} } };
    }

    if (typeof(this._options) === 'object') {
      if (!this._options.hasOwnProperty('url')) {
        return new Error('No url found');
      }
      let optionValues = Object.keys(this._options).map((value) => {
        return this.valide(value, this._options[value]);
      });
      let optionValidate = optionValues.filter((value) => {
        return (value instanceof Error) || value === ""
      });
      if (optionValidate.length > 0) {
        let errors = optionValidate.map((value) => {
          return value.message
        }).join(', ');
        return { err: new Error(`Error in options: ${errors}`), result: null };
      }
      let url = this._options.url;
      delete this._options.url;
      let option = Object.keys(this._options).map((value) => {
        return `${value}=${this._options[value]}`;
      }).join('&');

      result = { err: null, result: { url: url, options: option, raw: this._options } };
    }

    if (!validUrl.is_uri(result.result.url)) {
      return { err: new Error(`The URL: ${result.result.url}, is not valid`), result: null };
    }

    return result;
  }

}


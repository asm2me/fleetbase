'use strict';

const util = require('util');

if (typeof util.isRegExp !== 'function') {
    util.isRegExp = function isRegExp(value) {
        return util.types && typeof util.types.isRegExp === 'function' ? util.types.isRegExp(value) : Object.prototype.toString.call(value) === '[object RegExp]';
    };
}

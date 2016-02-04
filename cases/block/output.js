"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rebem = require('rebem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBEM(React, element) {
    if (element.__rebem) {
        return element.apply(undefined, Array.prototype.slice.call(arguments, 2));
    }

    return React.createElement.apply(React, Array.prototype.slice.call(arguments, 1));
}
function Test() {
    return checkBEM(_react2.default, _rebem.BEM, { block: 'test' });
}

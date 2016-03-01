"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _checkBEM = require("babel-plugin-transform-rebem-jsx").checkBEMProps;

function Test() {
    return _checkBEM(_react2.default, "div", { block: "test" });
}

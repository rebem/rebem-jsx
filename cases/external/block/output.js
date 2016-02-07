'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rebem = require('rebem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _checkBEM = require('babel-plugin-transform-rebem-jsx').checkBEM;

function Test() {
    return _checkBEM(_react2.default, _rebem.BEM, { block: 'test' });
}

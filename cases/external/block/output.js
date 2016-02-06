'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rebem = require('rebem');

var _babelPluginTransformRebemJsx = require('babel-plugin-transform-rebem-jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Test() {
    return (0, _babelPluginTransformRebemJsx.checkBEM)(_react2.default, _rebem.BEM, { block: 'test' });
}

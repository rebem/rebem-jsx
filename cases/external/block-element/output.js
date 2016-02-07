"use strict";

var _rebem = require("rebem");

var _checkBEM = require("babel-plugin-transform-rebem-jsx").checkBEM;

function Test() {
    return _checkBEM(React, _rebem.BEM, { block: "test" }, _checkBEM(React, _rebem.BEM, { block: "test", elem: "test2" }));
}

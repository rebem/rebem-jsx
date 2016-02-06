"use strict";

var _rebem = require("rebem");

var _babelPluginTransformRebemJsx = require("babel-plugin-transform-rebem-jsx");

function Test() {
    return (0, _babelPluginTransformRebemJsx.checkBEM)(React, _rebem.BEM, { block: "test" }, (0, _babelPluginTransformRebemJsx.checkBEM)(React, _rebem.BEM, { block: "test", elem: "test2" }));
}

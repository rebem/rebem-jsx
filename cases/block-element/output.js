"use strict";

var _rebem = require("rebem");

function checkBEM(React, element) {
    if (element.__rebem) {
        return element.apply(undefined, [].slice.call(arguments, 2));
    }

    return React.createElement.apply(React, [].slice.call(arguments, 1));
}
function Test() {
    return checkBEM(React, _rebem.BEM, { block: "test" }, checkBEM(React, _rebem.BEM, { block: "test", elem: "test2" }));
}

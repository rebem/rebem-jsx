"use strict";

var _rebem = require("rebem");

function Test() {
    function checkBEM(React, element) {
        if (element.__rebem) {
            return element.apply(undefined, Array.prototype.slice.call(arguments, 2));
        }

        return React.createElement.apply(React, Array.prototype.slice.call(arguments, 1));
    }
    return checkBEM(React, _rebem.BEM, { block: "test" }, checkBEM(React, _rebem.BEM, { block: "test", elem: "test2" }));
}

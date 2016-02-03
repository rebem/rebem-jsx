"use strict";

var _rebem = require("rebem");

function Test() {
    function checkBEM(element) {
        if (element.name === "BEM" || element.name === "blockFactory") {
            return element.apply(undefined, arguments.slice(1));
        }

        return React.createElement.apply(React, arguments);
    }
    return checkBEM(_rebem.BEM, { block: "test" }, checkBEM(_rebem.BEM, { block: "test", elem: "test2" }));
}

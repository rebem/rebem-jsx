import { stringify } from 'rebem-classname';

// finds direct children of globalPath
function findTopPath(path, globalPath) {
    if (path.parentPath === globalPath) {
        return path;
    }

    return findTopPath(path.parentPath, globalPath);
}

/*
TODO: investigate why ES6 module import (below) doesn't create variable [UID] declaration
[UID] is a generated scopedIdentifier — to avoid names collision

    var [UID] = require('babel-plugin-transform-rebem-jsx').checkBEMProps;

*/
function checkBEMExternal(t, scopedIdentifier) {
    return t.variableDeclaration(
        'var',
        [
            t.variableDeclarator(
                scopedIdentifier,
                t.memberExpression(
                    t.callExpression(
                        t.identifier('require'),
                        [
                            t.stringLiteral('babel-plugin-transform-rebem-jsx')
                        ]
                    ),
                    t.identifier('checkBEMProps')
                )
            )
        ]
    );
}

export default function({ types: t }) {
    return {
        visitor: {
            Program: {
                exit(globalPath) {
                    const checkBEMIdentifier = globalPath.scope.generateUidIdentifier('checkBEM');
                    let isCheckBEMInserted = false;

                    globalPath.traverse({
                        CallExpression(path) {
                            if (
                                t.isMemberExpression(path.node.callee) &&
                                t.isIdentifier(path.node.callee.object, { name: 'React' }) &&
                                t.isIdentifier(path.node.callee.property, { name: 'createElement' })
                            ) {
                                if (!isCheckBEMInserted) {
                                    const topPath = findTopPath(path, globalPath);

                                    topPath.insertBefore(
                                        checkBEMExternal(t, checkBEMIdentifier)
                                    );

                                    isCheckBEMInserted = true;
                                }
                                path.replaceWith(
                                    t.callExpression(
                                        checkBEMIdentifier,
                                        [ t.identifier('React') ].concat(path.node.arguments)
                                    )
                                );
                            }
                        }
                    });
                }
            }
        }
    };
}

// External helper for transforming BEM props into className
/* eslint-disable */
export function checkBEMProps(React, element, props) {
    var className = stringify(props);

    if (className) {
        props.className = className;
    }

    return React.createElement.apply(React, [element, props].concat([].slice.call(arguments, 3)));
}
/* eslint-enable */

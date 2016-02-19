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

    var [UID] = require('babel-plugin-transform-rebem-jsx').checkBEM;

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
                    t.identifier('checkBEM')
                )
            )
        ]
    );
}

/*
[UID] is a generated scopedIdentifier — to avoid names collision

    function [UID](React, element) {
        if (element.__rebem) {
            return element.apply(undefined, [].slice.call(arguments, 2));
        }
        return React.createElement.apply(React, [].slice.call(arguments, 1));
    }

*/
function checkBEMInline(t, scopedIdentifier) {
    return t.functionDeclaration(
        scopedIdentifier,
        [
            t.identifier('React'),
            t.identifier('element')
        ],
        t.blockStatement([
            t.ifStatement(
                t.memberExpression(
                    t.identifier('element'),
                    t.identifier('__rebem')
                ),
                t.blockStatement([
                    t.returnStatement(
                        t.callExpression(
                            t.memberExpression(
                                t.identifier('element'),
                                t.identifier('apply')
                            ),
                            [
                                t.identifier('undefined'),
                                t.callExpression(
                                    t.memberExpression(
                                        t.memberExpression(
                                            t.arrayExpression([]),
                                            t.identifier('slice')
                                        ),
                                        t.identifier('call')
                                    ),
                                    [
                                        t.identifier('arguments'),
                                        t.numericLiteral(2)
                                    ]
                                )
                            ]
                        )
                    )
                ])
            ),
            t.returnStatement(
                t.callExpression(
                    t.memberExpression(
                        t.memberExpression(
                            t.identifier('React'),
                            t.identifier('createElement')
                        ),
                        t.identifier('apply')
                    ),
                    [
                        t.identifier('React'),
                        t.callExpression(
                            t.memberExpression(
                                t.memberExpression(
                                    t.arrayExpression([]),
                                    t.identifier('slice')
                                ),
                                t.identifier('call')
                            ),
                            [
                                t.identifier('arguments'),
                                t.numericLiteral(1)
                            ]
                        )
                    ]
                )
            )
        ])
    );
}

export default function({ types: t }) {
    return {
        visitor: {
            Program: {
                exit(globalPath, { opts }) {
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

                                    if (opts && opts.externalHelper === false) {
                                        topPath.insertBefore(
                                            checkBEMInline(t, checkBEMIdentifier)
                                        );
                                    } else {
                                        topPath.insertBefore(
                                            checkBEMExternal(t, checkBEMIdentifier)
                                        );
                                    }

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

// External helper to reduce bundle size
// (available via `externalHelper: true` plugin options)
/* eslint-disable */
export function checkBEM(React, element) {
    if (element.__rebem) {
        return element.apply(undefined, [].slice.call(arguments, 2));
    }
    return React.createElement.apply(React, [].slice.call(arguments, 1));
}
/* eslint-enable */

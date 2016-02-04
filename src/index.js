// finds direct children of globalPath
function findTopPath(path, globalPath) {
    if (path.parentPath === globalPath) {
        return path;
    }

    return findTopPath(path.parentPath, globalPath);
}

/*
function checkBEM(React, element) {
    if (element.__rebem) {
        return element.apply(undefined, Array.prototype.slice.call(arguments, 2));
    }
    return React.createElement.apply(React, Array.prototype.slice.call(arguments, 1));
}
*/
function getCheckBEM(t) {
    return t.functionDeclaration(
        t.identifier('checkBEM'),
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
                                            t.memberExpression(
                                                t.identifier('Array'),
                                                t.identifier('prototype')
                                            ),
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
                                    t.memberExpression(
                                        t.identifier('Array'),
                                        t.identifier('prototype')
                                    ),
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
                exit(globalPath) {
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

                                    topPath.insertBefore(getCheckBEM(t));

                                    isCheckBEMInserted = true;
                                }
                                path.replaceWith(
                                    t.callExpression(
                                        t.identifier('checkBEM'),
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

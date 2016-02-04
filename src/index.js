export default function({ types: t }) {
    return {
        visitor: {
            Program: {
                exit(globalPath) {
                    let isInserted = false;

                    globalPath.traverse({
                        CallExpression(path) {
                            if (
                                t.isMemberExpression(path.node.callee) &&
                                t.isIdentifier(path.node.callee.object, { name: 'React' }) &&
                                t.isIdentifier(path.node.callee.property, { name: 'createElement' })
                            ) {
                                if (!isInserted) {
                                    path.parentPath.insertBefore(
                                        t.functionExpression(
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
                                        )
                                    );
                                    isInserted = true;
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

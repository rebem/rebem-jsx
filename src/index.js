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
                                                t.identifier('element')
                                            ],
                                            t.blockStatement([
                                                t.ifStatement(
                                                    t.logicalExpression(
                                                        '||',
                                                        t.binaryExpression(
                                                            '===',
                                                            t.memberExpression(
                                                                t.identifier('element'),
                                                                t.identifier('name')
                                                            ),
                                                            t.stringLiteral('BEM')
                                                        ),
                                                        t.binaryExpression(
                                                            '===',
                                                            t.memberExpression(
                                                                t.identifier('element'),
                                                                t.identifier('name')
                                                            ),
                                                            t.stringLiteral('blockFactory')
                                                        )
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
                                                                            t.identifier('arguments'),
                                                                            t.identifier('slice')
                                                                        ),
                                                                        [
                                                                            t.numericLiteral(1)
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
                                                            t.identifier('arguments')

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
                                        path.node.arguments
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

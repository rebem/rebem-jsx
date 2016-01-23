export default function({ types: t }) {
    return {
        visitor: {
            Program: {
                exit(globalPath) {
                    const BEMNames = [];

                    globalPath.traverse({
                        ImportDeclaration(path) {
                            /*
                                import { BEM as BEEP } from 'rebem';

                                ⬇︎

                                {
                                    type: 'ImportDeclaration',
                                    specifiers: [
                                        {
                                            type: 'ImportSpecifier',
                                            imported: { type: 'Identifier',  name: 'BEM' },
                                            local: { type: 'Identifier', name: 'BEEP' }
                                        }
                                    ],
                                    source: { type: 'StringLiteral', value: 'rebem' },
                                    ...
                                }

                                ⬇︎

                                BEM = [ 'BEEP' ]
                            */

                            if (t.isStringLiteral(path.node.source, { value: 'rebem' })) {
                                BEMNames.push(
                                    ...path.node.specifiers
                                        .filter(spec => t.isIdentifier(spec.imported, { name: 'BEM' }))
                                        .map(spec => spec.local.name)
                                );
                            }
                        },

                        CallExpression(path) {
                            /*
                                <BEM block="test"></BEM>

                                ⬇︎

                                React.createElement(BEM, { block: "test" })

                                ⬇︎

                                {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'MemberExpression',
                                        object: { type: 'Identifier', name: 'React' },
                                        property: { type: 'Identifier', name: 'createElement' },
                                    },
                                    arguments: [
                                        { type: 'Identifier', name: 'BEM' },
                                        { type: 'ObjectExpression', properties: ... }
                                    ],
                                    ...
                                }

                                ⬇︎

                                * POOF! *

                                ⬇︎

                                BEM({ block: "test" })
                            */

                            BEMNames.forEach(function(BEMName) {
                                // don't do anything if there is a scoped var with the same name
                                if (!path.scope.hasOwnBinding(BEMName)) {
                                    if (
                                        t.isMemberExpression(path.node.callee) &&
                                        t.isIdentifier(path.node.callee.object, { name: 'React' }) &&
                                        t.isIdentifier(path.node.callee.property, { name: 'createElement' }) &&
                                        t.isIdentifier(path.node.arguments[0], { name: BEMName })
                                    ) {
                                        path.replaceWith(
                                            t.callExpression(
                                                t.identifier(BEMName),
                                                path.node.arguments.slice(1)
                                            )
                                        );
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    };
}

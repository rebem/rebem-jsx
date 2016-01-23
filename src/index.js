export default function({ types: t }) {
    let BEM = null;

    return {
        visitor: {
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
                        ...
                    }

                    ⬇︎

                    BEM = 'BEEP'
                */

                const node = path.node;

                if (t.isStringLiteral(node.source, { value: 'rebem' })) {
                    node.specifiers.some(function(specifier) {
                        if (t.isIdentifier(specifier.imported, { name: 'BEM' })) {
                            BEM = specifier.local.name;

                            return true;
                        }
                    });
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

                if (BEM !== null) {
                    const node = path.node;

                    if (
                        t.isMemberExpression(node.callee) &&
                        t.isIdentifier(node.callee.object, { name: 'React' }) &&
                        t.isIdentifier(node.callee.property, { name: 'createElement' }) &&
                        t.isIdentifier(node.arguments[0], { name: BEM })
                    ) {
                        path.replaceWith(
                            t.callExpression(
                                t.identifier(BEM),
                                node.arguments.slice(1)
                            )
                        );
                    }
                }
            }
        }
    };
}

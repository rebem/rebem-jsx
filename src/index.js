/*
    <BEM block="test"></BEM>
*/

/*
    React.createElement(BEM, { block: "test" })
*/

/*
    { type: 'CallExpression',
        callee:
        { type: 'MemberExpression',
         object: { type: 'Identifier', name: 'React' },
         property: { type: 'Identifier', name: 'createElement' },
         computed: false },
        arguments:
        [ Node {
           type: 'Identifier',
           start: 60,
           end: 63,
           loc: [Object],
           name: 'BEM' },
         { type: 'ObjectExpression', properties: [Object] } ],
        ...
    }
*/

export default function({ types: t }) {
    return {
        visitor: {
            CallExpression(path) {
                const node = path.node;

                if (
                    t.isMemberExpression(node.callee) &&
                    t.isIdentifier(node.callee.object, { name: 'React' }) &&
                    t.isIdentifier(node.callee.property, { name: 'createElement' }) &&
                    t.isIdentifier(node.arguments[0], { name: 'BEM' })
                ) {
                    path.replaceWith(
                        t.callExpression(
                            t.identifier('BEM'),
                            node.arguments.slice(1)
                        )
                    );
                }
            }
        }
    };
}

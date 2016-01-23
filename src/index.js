// this is a temporary dumb replacement
export default function({ types: t }) {
    return {
        visitor: {
            JSXElement(path) {
                path.replaceWithSourceString('BEM({ block: \'test\' })');
            }
        }
    };
}

import { BEM } from 'rebem';

function Test() {
    return <BEM block="test">
        <BEM block="test" elem="test2"></BEM>
    </BEM>;
}

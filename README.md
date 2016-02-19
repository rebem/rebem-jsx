# babel-plugin-transform-rebem-jsx

[![npm](https://img.shields.io/npm/v/babel-plugin-transform-rebem-jsx.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-transform-rebem-jsx)
[![travis](http://img.shields.io/travis/rebem/rebem-jsx.svg?style=flat-square)](https://travis-ci.org/rebem/rebem-jsx)
[![deps](http://img.shields.io/david/rebem/rebem-jsx.svg?style=flat-square)](https://david-dm.org/rebem/rebem-jsx)

[Babel plugin](https://babeljs.io/docs/plugins/) allowing you to use JSX with [reBEM](https://github.com/rebem/rebem).

## Install

```sh
$ npm i -S babel-plugin-transform-rebem-jsx
```

### `.babelrc`

```js
// without options
{
  "plugins": ["transform-rebem-jsx"]
}
// with options
{
  "plugins": [
    ["transform-rebem-jsx", {
      "externalHelper": false // default is true
    }]
  ]
}
```

## Usage

### BEM

```js
import { BEM } from 'rebem';

<BEM tag="span" />
<BEM block="beep" />
<BEM block="beep" elem="boop" />
<BEM block="beep" mods={{ foo: 'bar' }} />
<BEM block="beep" mix={{ block: 'boop' }} />
```

```html
<span></span>
<div class="beep"></div>
<div class="beep__boop"></div>
<div class="beep beep_foo_bar"></div>
<div class="beep boop"></div>
```

### blockFactory

```js
import { blockFactory } from 'rebem';

// since it's a custom element it should be capitalized
const Block = blockFactory('beep');

<Block />
<Block elem="boop" />
<Block mods={{ foo: 'bar' }} />
<Block mix={{ block: 'boop' }} />
```

```html
<div class="beep"></div>
<div class="beep__boop"></div>
<div class="beep beep_foo_bar"></div>
<div class="beep boop"></div>
```

### TODO
- [x] docs
- [ ] move tasks to start-runner
- [ ] actual tests

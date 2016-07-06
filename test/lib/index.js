import path from 'path';
import fs from 'fs';
import assert from 'assert-diff';
import React from 'react';
import { default as plugin, checkBEMProps } from '../../lib';

// babel-core supports only commonJS
const babel = require('babel-core');

const pluginPath = require.resolve('../../lib');
const babelConfig = {
    presets: [ 'react' ],
    plugins: [ pluginPath ]
};

function normalizeLines(str) {
    return str.trimRight().replace(/\r\n/g, '\n');
}

describe('basic', function() {
    it('has default export', function() {
        assert(typeof plugin === 'function');
    });

    describe('checkBEMProps', function() {
        it('is a function', function() {
            assert(typeof checkBEMProps === 'function');
        });

        it('works with not defined props', function() {
            const element = checkBEMProps(React, 'span');

            assert(typeof element === 'object');
            assert(element.type === 'span');
        });

        it('works with null props', function() {
            const element = checkBEMProps(React, 'span', null);

            assert(typeof element === 'object');
            assert(element.type === 'span');
        });

        it('creates element with correct props', function() {
            const element = checkBEMProps(React, 'div', {
                tag: 'span',
                block: 'block',
                elem: 'elem',
                mix: {
                    block: 'block2'
                },
                mods: {
                    empty: true
                }
            });

            assert(typeof element.props.tag === 'undefined');
            assert(typeof element.props.block === 'undefined');
            assert(typeof element.props.elem === 'undefined');
            assert(typeof element.props.mix === 'undefined');
            assert(typeof element.props.mods === 'undefined');
        });
    });
});

describe('fixtures', function() {
    const fixturesDirname = path.resolve(__dirname, '../fixtures');

    fs.readdirSync(fixturesDirname)
        .map(fixturePath => path.resolve(fixturesDirname, fixturePath))
        .filter(fixturePath => fs.lstatSync(fixturePath).isDirectory())
        .forEach(fixturePath => {
            const testCase = path.parse(fixturePath).name;

            it(testCase, function() {
                const inputPath = path.resolve(fixturePath, 'input.js');
                const actual = babel.transformFileSync(inputPath, babelConfig).code;
                const outputPath = path.resolve(fixturePath, 'output.js');
                const expected = fs.readFileSync(outputPath, 'utf-8');

                assert.equal(
                    normalizeLines(actual),
                    normalizeLines(expected)
                );
            });
        });
});

import path from 'path';
// import assert from 'assert'; // TODO use actual assert?
import chalk from 'chalk';
import clear from 'clear';
import fs from 'fs';
import 'babel-register';

const babel = require('babel-core'); // TODO ES6 import returns undefined
const diff = require('diff');        // TODO ES6 import returns undefined
const pluginPath = require.resolve('../lib');

function normalizeLines(str) {
    return str.trimRight().replace(/\r\n/g, '\n');
}

function runTest(testPath, externalHelper) {
    const output = babel.transformFileSync(testPath + '/input.js', {
        presets: [ 'react' ],
        plugins: [
            [
                pluginPath,
                {
                    externalHelper
                }
            ]
        ]
    });
    const expected = fs.readFileSync(testPath + '/output.js', 'utf-8');

    diff.diffLines(normalizeLines(output.code), normalizeLines(expected))
        .forEach(part => {
            let value = part.value;

            if (part.added) {
                value = chalk.green(part.value);
            } else if (part.removed) {
                value = chalk.red(part.value);
            }
            process.stdout.write(value);
        });

    console.log();
}

function runTests() {
    const inlineDirName = path.resolve(__dirname, 'inline');
    const externalDirName = path.resolve(__dirname, 'external');

    console.log('inline');
    fs.readdirSync(inlineDirName)
        .map(testPath => path.resolve(inlineDirName, testPath))
        .filter(testPath => fs.lstatSync(testPath).isDirectory())
        .forEach(testPath => {
            console.log(testPath);
            runTest(testPath, false);
        });

    console.log('external');
    fs.readdirSync(externalDirName)
        .map(testPath => path.resolve(externalDirName, testPath))
        .filter(testPath => fs.lstatSync(testPath).isDirectory())
        .forEach(testPath => {
            console.log(testPath);
            runTest(testPath);
        });
}

if (process.argv.indexOf('--watch') >= 0) {
    require('watch').watchTree(path.resolve(__dirname, '/../lib'), function () {
        delete require.cache[pluginPath];
        clear();
        console.log('Press Ctrl+C to stop watching...');
        console.log('================================');
        try {
            runTests();
        } catch (e) {
            console.error(chalk.magenta(e.stack));
        }
    });
} else {
    runTests();
}

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

function runTest(testPath, checkProps) {
    const output = babel.transformFileSync(testPath + '/input.js', {
        presets: [ 'react' ],
        plugins: [
            [
                pluginPath,
                {
                    checkProps
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
            if (part.added || part.removed) {
                throw new Error('test failed');
            }
        });

    console.log();
}

function runTests() {
    const fixturesDirName = path.resolve(__dirname, 'fixtures');

    fs.readdirSync(fixturesDirName)
        .map(testPath => path.resolve(fixturesDirName, testPath))
        .filter(testPath => fs.lstatSync(testPath).isDirectory())
        .forEach(testPath => {
            console.log(testPath);
            runTest(testPath, true);
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

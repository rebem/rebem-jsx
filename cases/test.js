var assert = require('assert');
var babel = require('babel-core');
var chalk = require('chalk');
var clear = require('clear');
var diff = require('diff');
var fs = require('fs');

require('babel-register');

var pluginPath = require.resolve('../src');

function runTest(path) {
    var output = babel.transformFileSync(path + '/input.js', {
        presets: [ 'react' ],
        plugins: [ 'transform-runtime', pluginPath ]
    });

    var expected = fs.readFileSync(path + '/output.js', 'utf-8');

    function normalizeLines(str) {
        return str.trimRight().replace(/\r\n/g, '\n');
    }

    diff.diffLines(normalizeLines(output.code), normalizeLines(expected))
    .forEach(function (part) {
        var value = part.value;
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
    fs.readdirSync(__dirname).map(function (path) {
        return __dirname + '/' + path;
    }).filter(function (path) {
        return fs.lstatSync(path).isDirectory();
    }).forEach(function(path) {
        console.log(path);

        runTest(path);
    });
}

if (process.argv.indexOf('--watch') >= 0) {
    require('watch').watchTree(__dirname + '/../src', function () {
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

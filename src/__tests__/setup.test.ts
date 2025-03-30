import { pluginTester } from 'babel-plugin-tester';
import detectUsedProps from '..';
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import exp from 'constants';

const fixturesDir = path.join(__dirname, 'fixtures');

pluginTester({
    plugin: detectUsedProps,
    pluginName: 'babel-plugin-detect-used-props',
    babelOptions: {
        presets: [
            ['@babel/preset-env', { targets: { esmodules: true } }],
            '@babel/preset-react',
            '@babel/preset-typescript'
        ]
    },
    tests: fs.readdirSync(fixturesDir).map((fixture) => {
        const fixturePath = path.join(fixturesDir, fixture);
        return {
            title: fixture,
            pluginOptions: {
                filePath: path.join(fixturePath, 'output.json')
            },
            codeFixture: path.join(fixturePath, 'code.tsx'),
            outputFixture: path.join(fixturePath, 'code.tsx'),
            teardown() {
                const expectedPath = path.join(fixturePath, 'expected-output.json');
                const outputPath = path.join(fixturePath, 'output.json');

                if (!fs.existsSync(outputPath)) {
                    throw new Error(`Generated output file not found: ${outputPath}`);
                }

                const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf-8'));
                const actual = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));

                assert.deepEqual(actual, expected);
            }
        };
    })
});

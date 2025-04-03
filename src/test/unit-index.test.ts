import { pluginTester } from 'babel-plugin-tester';
import fs from 'fs';
import path from 'path';
import detectUsedProps from '..';

const fixturesDir = path.join(__dirname, 'fixtures');

pluginTester({
    plugin: detectUsedProps,
    pluginName: 'babel-plugin-detect-used-props',
    babelOptions: {
        parserOpts: {
            plugins: ['typescript', 'jsx']
        },
    },
    tests: fs.readdirSync(fixturesDir).map((fixture) => {
        const fixturePath = path.join(fixturesDir, fixture);
        const outputPath = path.join(fixturePath, 'output.json');
        return {
            title: fixture,
            pluginOptions: {
                filePath: path.join(fixturePath, 'output.json'),
                patterns: [`src/test/fixtures/${fixture}/*.tsx`]
            },
            codeFixture: path.join(fixturePath, 'code.tsx'),
            setup() {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }
            },
            async teardown() {
                const checkFileExistence = async () => {

                    while (!fs.existsSync(outputPath)) {
                        await new Promise(resolve => setTimeout(resolve, 5));
                    }

                    const expectedPath = path.join(fixturePath, 'expected-output.json');
                    const expected = JSON.parse(await fs.promises.readFile(expectedPath, 'utf-8'));
                    const actual = JSON.parse(await fs.promises.readFile(outputPath, 'utf-8'));

                    expect(actual).toMatchObject(expected);
                };

                await checkFileExistence();
            }
        };
    })
});

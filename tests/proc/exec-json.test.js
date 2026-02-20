module.exports = ({ test, assert }) => ({ proc }) => {

    const fn = proc.execJson;

    test('parses JSON output from command', async () => {
        const actual = await fn('node -e "process.stdout.write(JSON.stringify({a:1,b:2}))"');
        const expected = { a: 1, b: 2 };
        assert.deepEqual(actual, expected);
    });

    test('throws ExecJsonError when output is not valid JSON', async () => {
        const cmd = 'node -e "process.stdout.write(\'not-json\')"';

        try {
            await fn(cmd);
            assert.fail('expected rejection');
        } catch (err) {
            assert.equal(err.name, 'ExecJsonError');
            assert.equal(err.cmd, cmd);
            assert.equal(err.output, 'not-json');
            assert.match(err.message, /Failed to parse JSON from command/);
        }
    });

};

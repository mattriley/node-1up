module.exports = ({ test, assert }) => ({ proc }) => {

    const fn = proc.execText;

    test('returns stdout as text', async () => {
        const actual = await fn('node -e "process.stdout.write(\'ok\')"');
        assert.equal(actual, 'ok');
    });

    test('returns empty string when command only writes to stderr', async () => {
        const actual = await fn('node -e "console.error(\'warn\')"');
        assert.equal(actual, '');
    });

};

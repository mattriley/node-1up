module.exports = ({ test, assert, compose }) => () => {

    test('does not throw when path exists', () => {
        const { fsx } = compose({
            overrides: {
                fs: { existsSync: () => true }
            }
        });

        assert.doesNotThrow(() => fsx.assertExistsSync('/ok/path'));
    });

    test('throws when path does not exist', () => {
        const { fsx } = compose({
            overrides: {
                fs: { existsSync: () => false }
            }
        });

        assert.throws(() => fsx.assertExistsSync('/missing/path'), /Path not found/);
    });

};

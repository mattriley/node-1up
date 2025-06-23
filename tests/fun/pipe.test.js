module.exports = ({ test, assert }) => ({ fun }) => {

    const pipe = fun.pipe;

    test('pipe: array of functions', () => {
        const fn = pipe([
            x => x + ' bar',
            x => x + ' baz',
            x => x + ' qux'
        ]);
        assert.strictEqual(fn('foo'), 'foo bar baz qux');
    });

    test('pipe: object of functions', () => {
        const fn = pipe({
            one: x => x + ' bar',
            two: x => x + ' baz'
        });
        assert.strictEqual(fn('foo'), 'foo bar baz');
    });

    test('pipe: empty array returns input unchanged', () => {
        const fn = pipe([]);
        assert.strictEqual(fn('foo'), 'foo');
    });

    test('pipe: empty object returns input unchanged', () => {
        const fn = pipe({});
        assert.strictEqual(fn('foo'), 'foo');
    });

    test('pipe: context is passed through each function', () => {
        const context = { mark: '!' };
        const fn = pipe([
            (x, ctx) => x + ' bar' + ctx.mark,
            (x, ctx) => x + ' baz' + ctx.mark
        ]);
        assert.strictEqual(fn('foo', context), 'foo bar! baz!');
    });

    test('pipe: function returns undefined, next receives undefined', () => {
        const fn = pipe([
            x => undefined,
            x => x ?? 'fallback'
        ]);
        assert.strictEqual(fn('foo'), 'fallback');
    });

    test('pipe: throws on non-function in array', () => {
        assert.throws(() => {
            pipe([
                x => x + ' bar',
                'not a function'
            ]);
        }, /must be functions/);
    });

    test('pipe: throws on non-function in object', () => {
        assert.throws(() => {
            pipe({
                one: x => x + ' bar',
                two: 'not a function'
            });
        }, /must be functions/);
    });

    test('pipe: throws on invalid input type (string)', () => {
        assert.throws(() => {
            pipe('not valid');
        }, /expects an array or object/);
    });

    test('pipe: throws on null input', () => {
        assert.throws(() => {
            pipe(null);
        }, /expects an array or object/);
    });

};

module.exports = ({ test, assert }) => ({ arr }) => {

    test('empty input -> empty output', () => {
        const input = [];
        const actual = arr.steps(input);
        const expected = [];
        assert.deepEqual(actual, expected);
    });

    test('single element', () => {
        const input = ['foo'];
        const actual = arr.steps(input);
        const expected = [['foo']];
        assert.deepEqual(actual, expected);
    });

    test('multiple elements (basic)', () => {
        const input = ['foo', 'bar', 'baz', 'qux'];
        const actual = arr.steps(input);
        const expected = [
            ['foo'],
            ['foo', 'bar'],
            ['foo', 'bar', 'baz'],
            ['foo', 'bar', 'baz', 'qux']
        ];
        assert.deepEqual(actual, expected);
    });

    test('contract: each step equals input.slice(0, i+1)', () => {
        const input = ['a', 'b', 'c', 'd'];
        const actual = arr.steps(input);
        for (let i = 0; i < input.length; i++) {
            assert.deepEqual(actual[i], input.slice(0, i + 1));
        }
    });

    test('does not mutate input', () => {
        const input = ['x', 'y', 'z'];
        const copy = input.slice();
        void arr.steps(input);
        assert.deepEqual(input, copy);
    });

    test('each returned row is a fresh array (no shared refs)', () => {
        const input = ['x', 'y', 'z'];
        const actual = arr.steps(input);

        // rows themselves must be distinct arrays
        assert.ok(actual[0] !== actual[1] && actual[1] !== actual[2]);

        // mutating a row should not affect earlier rows
        actual[1].push('MUT'); // ['x','y','MUT']
        assert.deepEqual(actual[0], ['x']);           // unchanged
        assert.deepEqual(actual[1], ['x', 'y', 'MUT']);
        assert.deepEqual(actual[2], ['x', 'y', 'z']); // unaffected
    });

    test('preserves element identity (objects are not cloned)', () => {
        const o1 = { id: 1 }, o2 = { id: 2 };
        const input = [o1, o2];
        const actual = arr.steps(input);
        assert.strictEqual(actual[0][0], o1);
        assert.strictEqual(actual[1][0], o1);
        assert.strictEqual(actual[1][1], o2);
    });

};

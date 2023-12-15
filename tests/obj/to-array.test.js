module.exports = ({ test, assert }) => ({ obj }) => {

    test('default key name', () => {
        const input = { a: { aa: 11 }, b: { bb: 2 } };
        const expected = [{ key: 'a', val: { aa: 11 } }, { key: 'b', val: { bb: 2 } }];
        const actual = obj.toArray(input);
        assert.deepEqual(actual, expected);
    });

    test('custom key and value name', () => {
        const input = { a: { aa: 11 }, b: { bb: 2 } };
        const expected = [{ k: 'a', v: { aa: 11 } }, { k: 'b', v: { bb: 2 } }];
        const actual = obj.toArray(input, 'k', 'v');
        assert.deepEqual(actual, expected);
    });

    test('value is non-object', () => {
        const input = { a: 1, b: 2 };
        const expected = [{ key: 'a', val: 1 }, { key: 'b', val: 2 }];
        const actual = obj.toArray(input);
        assert.deepEqual(actual, expected);
    });

};

module.exports = ({ test, assert }) => ({ obj }) => {

    test('default key and value name', () => {
        const input = { a: 1, b: 2 };
        const expected = [{ key: 'a', val: 1 }, { key: 'b', val: 2 }];
        const actual = obj.entries(input);
        assert.deepEqual(actual, expected);
    });

    test('custom key and value name', () => {
        const input = { a: 1, b: 2 };
        const expected = [{ k: 'a', v: 1 }, { k: 'b', v: 2 }];
        const actual = obj.entries(input, 'k', 'v');
        assert.deepEqual(actual, expected);
    });

};

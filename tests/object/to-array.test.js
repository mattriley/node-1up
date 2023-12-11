module.exports = ({ test, assert }) => ({ obj }) => {

    test('default key name', () => {
        const input = { a: { aa: 11 }, b: { bb: 2 } };
        const expected = [{ key: 'a', aa: 11 }, { key: 'b', bb: 2 }];
        const actual = obj.toArray(input);
        assert.deepEqual(actual, expected);
    });

    test('custom key and value name', () => {
        const input = { a: { aa: 11 }, b: { bb: 2 } };
        const expected = [{ k: 'a', aa: 11 }, { k: 'b', bb: 2 }];
        const actual = obj.toArray(input, 'k');
        assert.deepEqual(actual, expected);
    });

};

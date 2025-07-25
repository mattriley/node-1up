module.exports = ({ test, assert }) => ({ str }) => {

    test('join with defaults (comma and ampersand)', () => {
        const joinLast = str.configure.join();
        const actual = joinLast(['apple', 'banana', 'cherry']);
        const expected = 'apple, banana & cherry';
        assert.equal(actual, expected);
    });

    test('join with only two items', () => {
        const joinLast = str.configure.join();
        const actual = joinLast(['apple', 'banana']);
        const expected = 'apple & banana';
        assert.equal(actual, expected);
    });

    test('join with single item', () => {
        const joinLast = str.configure.join();
        const actual = joinLast(['apple']);
        const expected = 'apple';
        assert.equal(actual, expected);
    });

    test('join with custom delimiter and final', () => {
        const joinLast = str.configure.join({ delimiter: ' | ', final: ' + ' });
        const actual = joinLast(['a', 'b', 'c']);
        const expected = 'a | b + c';
        assert.equal(actual, expected);
    });

    test('join with overridden delimiter and final at call time', () => {
        const joinLast = str.configure.join();
        const actual = joinLast(['x', 'y', 'z'], ' - ', ' ~ ');
        const expected = 'x - y ~ z';
        assert.equal(actual, expected);
    });

};

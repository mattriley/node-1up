module.exports = ({ test, assert }) => ({ fun }) => {

    const invokeEach = fun.invokeEach;

    test('invokes plain functions and returns literals unchanged', () => {
        const input = {
            addOne: x => x + 1,
            literal: 'hello',
            sum: (x, y) => x + y
        };

        const actual = invokeEach(input, 2, 3);
        const expected = [3, 'hello', 5];
        assert.deepEqual(actual, expected);
    });

    test('returns empty array for empty object', () => {
        assert.deepEqual(invokeEach({}), []);
    });

};

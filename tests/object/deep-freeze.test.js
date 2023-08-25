module.exports = ({ test, assert }) => ({ obj }) => {

    test('deep freeze', () => {
        const input = {
            obj: { a: 1 },
            fun: () => { }
        };
        obj.deepFreeze(input);
        input.foo = 'bar';
        input.obj.foo = 'bar';
        input.fun.foo = 'bar';
        assert.equal(input.foo, undefined);
        assert.equal(input.obj.foo, undefined);
        assert.equal(input.fun.foo, undefined);
    });

};

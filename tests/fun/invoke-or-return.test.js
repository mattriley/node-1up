module.exports = ({ test, assert }) => ({ fun }) => {

    const invokeOrReturn = fun.invokeOrReturn;

    test('invokeOrReturn: invokes arrow function', () => {
        const fn = (a, b) => a + b;
        const result = invokeOrReturn(fn, 2, 3);
        assert.strictEqual(result, 5);
    });

    test('invokeOrReturn: invokes bound function', () => {
        const fn = function (a, b) { return a + b; }.bind(null);
        const result = invokeOrReturn(fn, 1, 2);
        assert.strictEqual(result, 3);
    });

    test('invokeOrReturn: invokes anonymous inline function (no prototype)', () => {
        const result = invokeOrReturn((x) => x * 2, 4);
        assert.strictEqual(result, 8);
    });

    test('invokeOrReturn: does NOT invoke function with prototype', () => {
        function HasPrototype(x) { return x + 1; }
        const result = invokeOrReturn(HasPrototype, 5);
        // Should return the function itself, uninvoked
        assert.strictEqual(result, HasPrototype);
    });

    test('invokeOrReturn: does NOT invoke class constructor', () => {
        class MyClass {
            constructor() {
                this.value = 123;
            }
        }
        const result = invokeOrReturn(MyClass);
        assert.strictEqual(result, MyClass);
    });

    test('invokeOrReturn: returns non-function value directly', () => {
        assert.strictEqual(invokeOrReturn('value', 1, 2), 'value');
        assert.strictEqual(invokeOrReturn(42), 42);
        assert.strictEqual(invokeOrReturn(null), null);
        assert.strictEqual(invokeOrReturn(undefined), undefined);
        assert.deepStrictEqual(invokeOrReturn({ a: 1 }), { a: 1 });
    });

};

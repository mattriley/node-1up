const isPlainObj = v => v != null && typeof v === 'object' && !Array.isArray(v);

module.exports = ({ is }) => (...args) => {

    let steps;
    let defaultContext;
    let stateKey = 'state';
    let predicate;

    for (const arg of args) {
        if (is.plainFunction && is.plainFunction(arg)) {
            // last plain function wins as predicate (back-compat)
            predicate = arg;
            continue;
        }
        if (Array.isArray(arg)) {
            steps = arg; // first array wins
            continue;
        }
        if (typeof arg === 'string') {
            stateKey = arg;
            continue;
        }
        if (isPlainObj(arg)) {
            // If all values are functions and steps not set, treat as object-of-functions
            const values = Object.values(arg);
            const allFuncs = values.length > 0 && values.every(v => typeof v === 'function');
            if (!steps && allFuncs) {
                steps = values;
            } else {
                defaultContext = arg; // treat as options/context
            }
        }
    }

    if (!Array.isArray(steps)) {
        throw new TypeError('Expected an array or object of functions');
    }

    // Allow each step to be a function OR a plain object
    for (const step of steps) {
        const isFn = typeof step === 'function';
        if (!isFn && !isPlainObj(step)) {
            throw new TypeError('All elements must be functions or plain objects');
        }
    }

    return { steps, defaultContext, stateKey, predicate };
};

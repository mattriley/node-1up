module.exports = ({ is }) => (...args) => {

    let steps, defaultContext = {}, stateKey = 'state', predicate;

    for (const arg of args) {
        if (is.plainFunction(arg)) {
            predicate = arg;
        } else if (Array.isArray(arg)) {
            steps = arg;
        } else if (typeof arg === 'string') {
            stateKey = arg;
        } else if (typeof arg === 'object' && arg !== null) {
            const values = Object.values(arg);
            const allFuncs = values.length > 0 && values.every(v => typeof v === 'function');
            if (!steps && allFuncs) {
                steps = values;
            } else {
                defaultContext = arg;
            }
        }
    }

    if (!Array.isArray(steps)) {
        throw new TypeError('Expected an array or object of functions');
    }

    for (const step of steps) {
        if (typeof step !== 'function') {
            throw new TypeError('All elements must be functions');
        }
    }

    return { steps, defaultContext, stateKey, predicate };

};

// Last optimised on 21 June 2025.

const { setImmediate } = require('timers/promises');

module.exports = () => async (arr, chunkSize, loopPredicate, mapFunction) => {

    const shouldContinue = typeof loopPredicate === 'function'
        ? loopPredicate
        : () => loopPredicate;

    const results = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        if (!shouldContinue()) break;

        const chunk = arr.slice(i, i + chunkSize);
        const chunkResults = [];

        for (const item of chunk) {
            if (!shouldContinue()) break;
            chunkResults.push(mapFunction(item));
        }

        if (chunkResults.length > 0) {
            const resolved = await Promise.all(chunkResults);
            results.push(...resolved);
        }

        await setImmediate(); // allow event loop to process e.g. SIGINT
    }

    return results;

};

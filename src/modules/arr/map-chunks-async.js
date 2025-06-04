const _ = require('lodash');
const { setImmediate } = require('timers/promises');

module.exports = async (arr, chunkSize, loopPredicate, mapFunction) => {

    loopPredicate = _.isFunction(loopPredicate) ? loopPredicate : () => loopPredicate;
    let loop = true;
    const results = [];
    const chunks = _.chunk(arr, chunkSize);

    for (const chunk of chunks) {
        const chunkPromises = [];
        for (const item of chunk) {
            chunkPromises.push(mapFunction(item));
            loop = loopPredicate();
            if (!loop) break;

        }
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
        if (!loop) break;
        await setImmediate(); // allows SIGINT
    }

    return results;

};

module.exports = () => async (obj, iteratee) => {

    const mapper = async ([key, val]) => [key, await iteratee({ key, val, obj })];
    const entries = await Promise.all(Object.entries(obj).map(mapper));
    return Object.fromEntries(entries);

};

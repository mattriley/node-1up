module.exports = () => (obj, iteratee) => {

    const mapper = ([key, val]) => [key, iteratee({ key, val, obj })];
    return Object.fromEntries(Object.entries(obj).map(mapper));

};

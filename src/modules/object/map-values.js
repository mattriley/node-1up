module.exports = (obj, iteratee) => {

    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
        return [key, iteratee(key, val, obj)];
    }));

};

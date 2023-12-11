module.exports = (obj, iteratee) => {

    return Object.fromEntries(Object.entries(obj).flatMap(([key, val]) => {
        return iteratee({ key, val, obj }).map(key => [key, val]);
    }));

};

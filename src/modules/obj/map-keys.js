module.exports = () => (obj, iteratee) => {

    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
        return [iteratee({ key, val, obj }), val];
    }));

};

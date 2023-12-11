module.exports = (obj, keyName = 'key') => {

    return Object.entries(obj).map(([key, val]) => {
        return { [keyName]: key, ...val };
    });

};

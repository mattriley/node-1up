module.exports = (obj, keyName = 'key') => {

    return Object.entries(obj).map(([key, val]) => {
        const newVal = _.isPlainObject(val) ? val : { [key]: val };
        return { [keyName]: key, ...newVal };
    });

};

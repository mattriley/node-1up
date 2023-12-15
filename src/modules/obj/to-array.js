module.exports = () => (obj, keyName = 'key', valName = 'val') => {

    return Object.entries(obj).map(([key, val]) => {
        return { [keyName]: key, [valName]: val };
    });

};

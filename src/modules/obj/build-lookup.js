module.exports = () => (items, keyNames) => {

    return Object.assign(...keyNames.map(keyName => {
        return _.groupBy(items, item => {
            return item[keyName]?.toUpperCase();
        });
    }));

};

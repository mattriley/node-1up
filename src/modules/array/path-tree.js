module.exports = () => paths => {

    return _.uniq(paths).reduce((acc, path) => {
        const keyPath = path.replaceAll('/', '.');
        return _.set(acc, keyPath, _.get(acc, keyPath, {}));
    }, {});

};

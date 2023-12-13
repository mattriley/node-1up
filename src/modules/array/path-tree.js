module.exports = ({ fun }) => (arr, iteratee) => {

    const iterateeIsFunction = fun.isPlainFunction(iteratee);
    const paths = arr.map(obj => iterateeIsFunction ? iteratee(obj) : _.get(obj, iteratee));
    const uniquePaths = _.uniq(paths);

    return uniquePaths.reduce((acc, path) => {
        const keyPath = path.replaceAll('/', '.');
        return _.set(acc, keyPath, _.get(acc, keyPath, {}));
    }, {});

};

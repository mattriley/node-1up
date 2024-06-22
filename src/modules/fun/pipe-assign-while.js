module.exports = ({ self }) => (predicate, ...funs) => {

    return funs.reduce((acc, fun) => {
        return predicate(acc) ? { ...acc, ...self.invokeOrReturn(fun, acc) } : acc;
    }, {});

};

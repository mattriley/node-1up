module.exports = ({ self }) => (...funs) => {

    return funs.reduce((acc, fun) => ({ ...acc, ...self.invokeOrReturn(fun, acc) }), {});

};

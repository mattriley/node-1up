module.exports = ({ f }) => (...funs) => {

    return funs.reduce((acc, fun) => ({ ...acc, ...f.invokeOrReturn(fun, acc) }), {});

};

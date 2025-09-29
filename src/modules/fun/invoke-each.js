module.exports = $ => (funs, ...args) => {

    return Object.values(funs).map(fun => $.self.invokeOrReturn(fun, ...args));

};

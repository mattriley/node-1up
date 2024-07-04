module.exports = ({ self }) => {

    const _pipeAssign = (...args) => (...funs) => {
        return funs.reduce((acc, fun) => ({ ...acc, ...self.invokeOrReturn(fun, acc, ...args) }), {});
    };

    const pipeAssign = _pipeAssign();
    pipeAssign.args = (...args) => _pipeAssign(...args);
    return pipeAssign;

};

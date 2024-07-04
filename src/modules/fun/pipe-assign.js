module.exports = ({ self }) => {

    const _pipeAssign = (...args) => (...funs) => {
        const invoke = (fun, acc) => args.length ? fun(...args)(acc) : fun(acc);

        return funs.flat().reduce((acc, fun) => {
            const res = fun && self.isPlainFunction(fun) ? invoke(fun, acc) : fun;
            return { ...acc, ...res };
        }, {});
    };

    const pipeAssign = _pipeAssign();
    pipeAssign.args = (...args) => _pipeAssign(...args);
    return pipeAssign;

};

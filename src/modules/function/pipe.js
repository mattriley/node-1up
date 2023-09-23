module.exports = () => (funs, initial) => {

    const pipe = funs => initial => funs.reduce((inp, fun) => fun(inp), initial);
    return initial ? pipe(funs)(initial) : pipe(funs);

};

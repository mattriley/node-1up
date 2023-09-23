module.exports = () => (funs, initial) => {

    const pipeAsync = funs => initial => funs.reduce(async (inp, fun) => fun(await inp), initial);
    return initial ? pipeAsync(funs)(initial) : pipeAsync(funs);

};

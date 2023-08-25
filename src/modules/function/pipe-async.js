const pipeAsync = functions => initial => functions.reduce(async (inp, fun) => fun(await inp), initial);
module.exports = (functions, initial) => initial ? pipeAsync(functions)(initial) : pipeAsync(functions);

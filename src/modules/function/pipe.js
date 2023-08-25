const pipe = functions => initial => functions.reduce((inp, fun) => fun(inp), initial);
module.exports = (functions, initial) => initial ? pipe(functions)(initial) : pipe(functions);

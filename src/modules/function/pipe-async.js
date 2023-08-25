const pipeAsync = functions => initial => functions.reduce(async (p, f) => f(await p), initial);
module.exports = (functions, initial) => initial ? pipeAsync(functions)(initial) : pipeAsync(functions);

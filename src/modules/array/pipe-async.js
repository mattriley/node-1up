module.exports = functions => initial => {

    return functions.reduce(async (p, f) => f(await p), initial);

};

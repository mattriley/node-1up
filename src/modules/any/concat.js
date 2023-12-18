module.exports = (...values) => {

    return values.flat().filter(val => val !== undefined && val !== null);

};

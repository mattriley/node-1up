module.exports = () => (obj, transform) => {

    return Object.fromEntries(transform(Object.entries(obj)));

};

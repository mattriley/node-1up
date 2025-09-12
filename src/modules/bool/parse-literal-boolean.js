module.exports = () => val => {

    if (val == null) return undefined; // handles null & undefined

    const str = String(val); // safe coercion
    if (str === 'false') return false;
    if (str === 'true') return true;

    return undefined; // anything else

};

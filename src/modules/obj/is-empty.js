module.exports = () => val => {

    if (val == null || val === '') return true; // catches null and undefined
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;

};

module.exports = () => val => {

    const t = typeof val;
    return (
        val === null ||
        t === 'boolean' ||
        t === 'number' ||
        t === 'string' ||
        Array.isArray(val) ||
        (t === 'object' && val.constructor === Object)
    );

};

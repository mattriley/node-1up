module.exports = () => obj => {

    console.warn('obj.clean is deprecated.')
    return Object.entries(obj).reduce((acc, [k, v]) => (v == null ? acc : (acc[k] = v, acc)), {});

};

module.exports = () => obj => {

    return Object.entries(obj).reduce((acc, [k, v]) => (v == null ? acc : (acc[k] = v, acc)), {});

};

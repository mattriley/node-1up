const _ = require('lodash');

module.exports = () => (obj, path, def) => {

    const parts = Array.isArray(path) ? path : path.split('.');

    for (let i = parts.length; i > 0; i--) {
        const pathArr = i === parts.length ? path : parts.slice(0, -i).concat(parts.slice(-i).join('.'));
        const res = _.get(obj, pathArr);
        if (res) return res;
    }

    return def;

};

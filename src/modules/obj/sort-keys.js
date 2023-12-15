module.exports = obj => {

    return _.pick(obj, Object.keys(obj).sort());

};

module.exports = () => val => {

    return _.isFunction(val) && !val.hasOwnProperty('prototype');

};

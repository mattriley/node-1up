/* eslint-disable no-prototype-builtins */

module.exports = () => val => {

    return _.isFunction(val) && !val.hasOwnProperty('prototype');

};

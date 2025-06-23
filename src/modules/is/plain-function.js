module.exports = () => val => {

    return typeof val === 'function' && !val.hasOwnProperty('prototype');

};

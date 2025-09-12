module.exports = () => val => {

    return typeof val === 'string' && val.trim() !== '';

};

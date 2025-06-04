module.exports = () => (num, max) => {

    return num.toString().padStart(max.toString().length, '0');

};

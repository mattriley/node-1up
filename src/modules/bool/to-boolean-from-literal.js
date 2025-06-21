module.exports = () => val => {

    const str = val.toString();
    if (str === 'false') return false;
    if (str === 'true') return true;

}

// Last optimised on 20 June 2025.

module.exports = () => (arr, sep = ',', finalSep = sep) => {

    if (arr.length <= 1) return arr[0] || '';
    return arr.slice(0, -1).join(sep) + finalSep + arr[arr.length - 1];

};

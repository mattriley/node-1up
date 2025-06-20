// Last optimised on 20 June 2025.

module.exports = ({ config }) => (arr, delimiter = config.delimiter, finalDelimiter = delimiter) => {

    if (arr.length <= 1) return arr[0] || '';
    return arr.slice(0, -1).join(delimiter) + finalDelimiter + arr[arr.length - 1];

};

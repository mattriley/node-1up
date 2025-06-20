// Last optimised on 20 June 2025.

module.exports = () => (arr, item) => {

    if (arr.length < 2) return [...arr, item];
    return [...arr.slice(0, -1), item, arr[arr.length - 1]];

};

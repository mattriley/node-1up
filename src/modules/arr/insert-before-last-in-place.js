// Last optimised on 20 June 2025.

module.exports = () => (arr, item) => {

    if (arr.length < 2) arr.push(item);
    else arr.splice(arr.length - 1, 0, item);
    return arr;

};

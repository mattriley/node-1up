module.exports = () => (arr, item) => {

    const index = Math.max(arr.length - 1, 0);
    return [...arr.slice(0, index), item, ...arr.slice(index)];

}

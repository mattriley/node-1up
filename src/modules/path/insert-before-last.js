module.exports = ({ arr, config }) => (pathname, item, delimiter = config.pathDelimiter) => {

    return arr.insertBeforeLast(pathname.split(delimiter), item).join(delimiter);

}

module.exports = ({ arr, config }) => (pathname, item, delimiter = config.pathDelimiter) => {

    return arr.insertBeforeLast(pathname.split(sep), item).join(delimiter);

}

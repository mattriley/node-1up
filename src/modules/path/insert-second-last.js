module.exports = ({ arr }) => (pathname, item, sep = require('path').sep) => {

    return arr.insertSecondLast(pathname.split(sep), item).join(sep);

}

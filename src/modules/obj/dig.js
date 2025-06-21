module.exports = ({ self }) => (obj, path, defaultValue = undefined) => {

    return self.getDeep(obj, path, defaultValue);

}

module.exports = ({ self }) => {

    const configure = self.sortKeysConfigure;
    const sortKeys = configure();
    return Object.assign(sortKeys, { configure });

}

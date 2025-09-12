module.exports = ({ self }) => {

    const configure = self.sortKeysConfigure;
    const sortKeys = configure({ mutate: false });
    return Object.assign(sortKeys, { configure });

}

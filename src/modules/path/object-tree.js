module.exports = ({ self }) => {

    const configure = self.objectTreeConfigure;
    const objectTree = configure();
    return Object.assign(objectTree, { configure });

}

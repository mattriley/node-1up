module.exports = ({ self }) => {

    const configure = self.joinConfigure;
    const join = configure();
    return Object.assign(join, { configure });

}

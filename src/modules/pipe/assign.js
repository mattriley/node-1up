module.exports = ({ self }) => {

    const configure = self.assignConfigure;
    const assign = configure();
    return Object.assign(assign, { configure });

};

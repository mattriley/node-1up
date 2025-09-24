module.exports = ({ self }) => {

    const configure = self.assignConfigure;
    const assign = configure();
    const defer = configure({ defer: true });
    return Object.assign(assign, { configure, defer });

};

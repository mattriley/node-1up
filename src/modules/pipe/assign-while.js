module.exports = ({ self }) => {

    const configure = self.assignWhileConfigure;
    const assignWhile = configure();
    const defer = configure({ defer: true });
    return Object.assign(assignWhile, { configure, defer });

};

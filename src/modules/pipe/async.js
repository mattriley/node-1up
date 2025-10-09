module.exports = ({ self }) => {

    const configure = self.asyncConfigure;
    const async = configure();
    const defer = configure({ defer: true });
    return Object.assign(async, { configure, defer });

};

module.exports = ({ self }) => {

    const configure = self.assignAsyncConfigure;
    const assignAsync = configure();
    const defer = configure({ defer: true });
    return Object.assign(assignAsync, { configure, defer });

};

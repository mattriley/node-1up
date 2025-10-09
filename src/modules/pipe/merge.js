module.exports = ({ self }) => {

    const configure = self.mergeConfigure;
    const merge = configure();
    const defer = configure({ defer: true });
    return Object.assign(merge, { configure, defer });

};

module.exports = ({ self }) => {

    const configure = self.pipeConfigure;
    const pipe = configure();
    const defer = configure({ defer: true });
    return Object.assign(pipe, { configure, defer });

};

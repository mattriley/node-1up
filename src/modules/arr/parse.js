module.exports = ({ self }) => {

    const configure = self.parseConfigure;
    const parse = configure();
    return Object.assign(parse, { configure });

};

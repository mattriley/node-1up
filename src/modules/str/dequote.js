module.exports = ({ self }) => {

    const configure = self.dequoteConfigure;
    const dequote = configure();
    return Object.assign(dequote, { configure });

};

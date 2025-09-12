module.exports = ({ self }) => {

    const configure = self.setConfigure;
    const set = configure.set();
    return Object.assign(set, { configure });

}

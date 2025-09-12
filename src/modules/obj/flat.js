module.exports = ({ self }) => {

    const configure = self.flatConfigure;
    const flat = configure();
    return Object.assign(flat, { configure });

}

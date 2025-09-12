module.exports = ({ self }) => {

    const configure = self.pickConfigure();
    const pick = configure();
    return Object(pick, { configure });

}

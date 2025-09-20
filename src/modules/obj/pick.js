module.exports = ({ self }) => {

    const configure = self.pickConfigure;
    const pick = configure();
    return Object.assign(pick, { configure });

};

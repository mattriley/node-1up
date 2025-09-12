module.exports = ({ self }) => {

    const configure = self.writeJsonLikeConfigure;
    const writeJsonLike = configure();
    return Object.assign(writeJsonLike, { configure });

}

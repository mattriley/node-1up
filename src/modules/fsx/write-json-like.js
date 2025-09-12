module.exports = ({ self }) => {

    const writeJsonLike = self.writeJsonLikeConfigure();
    writeJsonLike.configure = self.writeJsonLikeConfigure;
    return writeJsonLike;

}

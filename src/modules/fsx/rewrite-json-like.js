module.exports = ({ self }) => {

    const rewriteJsonLike = self.rewriteJsonLikeConfigure();
    rewriteJsonLike.configure = self.rewriteJsonLikeConfigure;
    return rewriteJsonLike;

}

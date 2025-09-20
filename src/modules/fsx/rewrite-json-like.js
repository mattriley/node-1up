module.exports = ({ self }) => {

    const configure = self.rewriteJsonLikeConfigure;
    const rewriteJsonLike = configure();
    return Object.assign(rewriteJsonLike, { configure });

};

module.exports = ({ self, config }) => (path, transform, indent = config.indent) => {

    const current = self.readJsonLikeSync(path);
    const updated = transform(current);
    return self.writeJsonLikeSync(path, updated, indent);

};

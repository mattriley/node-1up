module.exports = ({ self, config }) => async (path, transform, indent = config.indent) => {

    const current = await self.readJsonLike(path);
    const updated = await transform(current);
    return await self.writeJsonLike(path, updated, indent);

};

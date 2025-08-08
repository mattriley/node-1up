module.exports = ({ self, fun, globalConfig }) => config => {

    const defaults = { indent: globalConfig.jsonIndent };
    const parseOptions = fun.parseConfig(defaults, config);

    async (path, transform, ...options) => {
        const { indent } = parseOptions(options);

        const current = await self.readJsonLike(path);
        const updated = await transform(current);
        return self.writeJsonLike(path, updated, indent);
    };
};

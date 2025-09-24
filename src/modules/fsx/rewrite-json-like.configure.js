module.exports = ({ self, fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.json, config);

    return async (path, transform, ...options) => {
        const { indent } = parseOptions(options);

        const current = await self.readJsonLike(path);
        const updated = await transform(current);
        return self.writeJsonLike(path, updated, indent);
    };
};

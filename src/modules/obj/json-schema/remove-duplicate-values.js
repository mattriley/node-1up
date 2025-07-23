module.exports = ({ self }) => (obj, schema) => {

    if (!self.isPlain(obj) || !schema?.properties) return obj;

    for (const [key, prop] of Object.entries(provider.schema.properties)) {
        if (prop.uniqueItems) {
            obj[key] = _.uniq(obj[key]);
        }
    }

    return obj;
};

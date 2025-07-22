module.exports = ({ self }) => (obj, schema) => {

    if (!self.isPlain(obj) || !schema?.properties) return obj;

    for (const [k, prop] of Object.entries(schema.properties)) {
        if (prop.delete) delete obj[k];
    }

    return obj;
};

module.exports = $ => (obj, schema) => {

    if (!$.obj.isPlain(obj) || !schema?.properties) return obj;

    for (const [k, prop] of Object.entries(schema.properties)) {
        if (prop.delete) delete obj[k];
    }

    return obj;
};

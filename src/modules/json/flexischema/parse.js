const newArray = () => [];
const newObject = () => ({});
const newString = () => '';


const getDefault = type => {
    const types = [type ?? []].flat();
    if (types.includes('array')) return newArray;
    if (types.includes('object')) return newObject;
    if (types.includes('string')) return newString;
};


module.exports = () => schema => {

    schema = typeof schema === 'function' ? schema() : schema;
    const hasSchema = !!schema;
    if (!hasSchema) return { hasSchema };

    schema = {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
        ...schema
    };

    Object.entries(schema.properties).forEach(([key, prop]) => {
        prop.key = key;
        if (prop.type === 'array') prop.type = ['string', 'array'];
        prop.items = { type: 'string', ...(prop.items ?? {}) };
        const aliases = [key];
        if (prop.alias) aliases.push(...prop.alias);
        if (prop.name) aliases.push(prop.name);
        prop.alias = aliases;
        prop.getDefault = getDefault(prop.type);
    });

    const props = Object.entries(schema.properties).reduce((acc, [key, prop]) => {
        const allKeys = [key, ...prop.alias];
        allKeys.forEach(key => { acc[key] = { key, ...prop }; });
        return acc;
    }, {});

    return { hasSchema, schema, props };

};

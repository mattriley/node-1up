module.exports = $ => {

    const removeNonEnumValues = (obj, schema) => {
        if (!obj || !schema?.properties) return obj;

        for (const [key, propSchema] of Object.entries(schema.properties)) {
            const val = obj[key];

            // Handle arrays/scalars with enum constraint
            if (propSchema.items?.enum) {
                const values = [val].flat();
                const allowed = new Set(propSchema.items.enum);
                obj[key] = values.filter(v => allowed.has(v));
                continue;
            }

            // Recurse into nested objects
            if ($.obj.isPlain(val) && propSchema.type === 'object' && propSchema.properties) {
                removeNonEnumValues(val, propSchema);
                continue;
            }

            // Recurse into array of objects
            if (
                Array.isArray(val) &&
                propSchema.type === 'array' &&
                propSchema.items?.type === 'object' &&
                propSchema.items?.properties
            ) {
                obj[key] = val.map(item => {
                    return $.obj.isPlain(item)
                        ? removeNonEnumValues(item, propSchema.items)
                        : item;
                });
            }
        }

        return obj;
    };

    return removeNonEnumValues;
};

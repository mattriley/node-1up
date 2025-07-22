module.exports = ({ self }) => {

    const removeNonEnumValues = (obj, schema) => {
        if (!self.isPlain(obj) || !schema?.properties) return obj;

        for (const [key, propSchema] of Object.entries(schema.properties)) {
            const val = obj[key];

            // Handle arrays with enum constraint
            if (Array.isArray(val) && Array.isArray(propSchema.enum)) {
                const allowed = new Set(propSchema.enum);
                obj[key] = val.filter(v => allowed.has(v));
                continue;
            }

            // Recurse into nested objects
            if (self.isPlain(val) && propSchema.type === 'object' && propSchema.properties) {
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
                    return self.isPlain(item)
                        ? removeNonEnumValues(item, propSchema.items)
                        : item;
                });
            }
        }

        return obj;
    };

    return removeNonEnumValues;
};

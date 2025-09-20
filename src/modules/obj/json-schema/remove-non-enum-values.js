module.exports = ({ self }) => {

    const removeNonEnumValues = (obj, schema) => {
        if (!obj || !schema) return obj;

        for (const [key, propSchema] of Object.entries(schema.properties)) {
            const val = [obj[key]].flat(); // ensure array

            // Handle arrays with enum constraint
            if (propSchema.items.enum) {
                const allowed = new Set(propSchema.items.enum);
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
                    return self.isPlain(item)? removeNonEnumValues(item, propSchema.items): item;
                });
            }
        }

        return obj;
    };

    return removeNonEnumValues;
};

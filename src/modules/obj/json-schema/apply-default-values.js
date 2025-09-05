module.exports = ({ self }) => (obj, schema) => {

    if (!self.isPlain(obj) || !schema?.properties) return obj;

    for (const [key, prop] of Object.entries(schema.properties)) {
        if (key in obj) continue;

        // Use default if provided
        if ('default' in prop) {
            obj[key] = prop.default;
            continue;
        }

        const types = Array.isArray(prop.type) ? prop.type : [prop.type];
        if (!types.length) continue;

        const typeHandlers = {
            array: () => {
                if (prop.items?.type === 'object' && prop.items?.properties) {
                    return [self.applyDefaultValues({}, prop.items)];
                }
                return [];
            },
            object: () => self.applyDefaultValues({}, prop),
            string: () => '',
            number: () => 0,
            integer: () => 0,
            boolean: () => false,
            null: () => null
        };

        for (const type of types) {
            const handler = typeHandlers[type];
            if (handler) {
                obj[key] = handler();
                break;
            }
        }

        // Fall back to enum if no known type handled it
        if (!(key in obj) && Array.isArray(prop.enum) && prop.enum.length > 0) {
            obj[key] = prop.enum[0];
        }
    }

    return obj;
};

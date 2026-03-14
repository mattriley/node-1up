module.exports = $ => (input, schema) => {

    if (!$.obj.isPlain(input) || !schema?.properties) return input;

    for (const [key, prop] of Object.entries(schema.properties)) {
        if (key in input) continue;

        // Use default if provided
        if ('default' in prop) {
            input[key] = prop.default;
            continue;
        }

        const types = Array.isArray(prop.type) ? prop.type : [prop.type];
        if (!types.length) continue;

        const typeHandlers = {
            array: () => {
                if (prop.items?.type === 'object' && prop.items?.properties) {
                    return [$.here.applyDefaultValues({}, prop.items)];
                }
                return [];
            },
            object: () => $.here.applyDefaultValues({}, prop),
            string: () => '',
            number: () => 0,
            integer: () => 0,
            boolean: () => false,
            null: () => null
        };

        for (const type of types) {
            const handler = typeHandlers[type];
            if (handler) {
                input[key] = handler();
                break;
            }
        }

        // Fall back to enum if no known type handled it
        if (!(key in input) && Array.isArray(prop.enum) && prop.enum.length > 0) {
            input[key] = prop.enum[0];
        }
    }

    return input;
};

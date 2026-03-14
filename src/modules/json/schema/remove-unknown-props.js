module.exports = ({ self }) => {

    const removeUnknownProps = (obj, schema) => {
        if (!self.isPlain(obj) || !schema?.properties) return obj;

        const allowedKeys = Object.keys(schema.properties);

        for (const key of Object.keys(obj)) {
            if (!allowedKeys.includes(key)) {
                delete obj[key];
                continue;
            }

            const propSchema = schema.properties[key];
            const val = obj[key];

            if (self.isPlain(val) && propSchema.type === 'object' && propSchema.properties) {
                removeUnknownProps(val, propSchema);
            }

            if (Array.isArray(val) && propSchema.type === 'array' && propSchema.items?.type === 'object') {
                obj[key] = val.map(item => {
                    return self.isPlain(item)? removeUnknownProps(item, propSchema.items): item;
                });
            }
        }

        return obj;
    };

    return removeUnknownProps;
};

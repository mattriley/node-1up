module.exports = ({ self }) => (obj, schema) => {

    if (!self.isPlain(obj) || !schema?.properties) return obj;

    for (const [key, prop] of Object.entries(schema.properties)) {
        if (prop.uniqueItems && Array.isArray(obj[key])) {
            const seen = new Set();
            obj[key] = obj[key].filter(item => {
                const id = self.isPlain(item) ? JSON.stringify(item) : item;
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            });
        }
    }

    return obj;
};

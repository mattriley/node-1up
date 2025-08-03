module.exports = () => ({ exif }) => {

    return Object.fromEntries(
        Object.entries(exif).map(([key, value]) => {
            const newKey = key.includes(':') ? key.split(':').pop() : key;
            return [newKey, value];
        })
    );

};

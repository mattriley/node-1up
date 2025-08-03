module.exports = () => ({ exif }) => {

    return Object.fromEntries(
        Object.entries(exif).filter(([key]) => !/^Track\d+:/.test(key))
    );

};

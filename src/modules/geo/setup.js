module.exports = ({ self, config }) => () => {

    const { locationData } = config;
    return { ...self, locationData };

}

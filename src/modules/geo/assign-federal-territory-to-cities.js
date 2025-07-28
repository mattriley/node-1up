module.exports = () => ({ cities, federalTerritoryCities }) => {

    return cities.map(city => {
        // TODO: add country to the predicate.
        const { territory } = federalTerritoryCities.find(fed => fed.city === city.name) ?? {};
        if (!territory) return city;
        return { ...city, federalTerritory: territory };
    });

};

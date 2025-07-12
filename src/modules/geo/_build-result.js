module.exports = () => (cityData, stateData, countryData, moreData) => {

    return {
        'city': cityData?.name,
        'state': stateData?.name,
        'state.iso': stateData?.isoCode,
        'country': countryData?.name,
        'country.iso': countryData?.isoCode,
        ...moreData
    }

};

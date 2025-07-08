module.exports = () => (cityData, stateData, countryData, moreData) => {

    return {
        'city': cityData?.name,
        'city.iata': cityData?.iataCode,
        'state': stateData?.name,
        'state.iso': stateData?.isoCode,
        'country': countryData?.name,
        'country.iso2': countryData?.isoCode,
        ...moreData
    }

};

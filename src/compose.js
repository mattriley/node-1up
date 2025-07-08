const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];

    const { configure } = composer(modules, { functionAlias, overrides });

    const { compose } = configure(defaultConfig, config, config => {
        const { cities, states, countries } = config.locationData;

        const lookupPlan = {
            country: [countries, 'name', 'isoCode'],
            state: [states, 'name', 'isoCode'],
            city: [cities, 'name', 'iataCode'],
            statesByCountry: [states, 'country', 'countryCode']
        };

        const lookup = _.mapValues(lookupPlan, args => {
            const [items, ...keyNames] = args;
            return Object.assign(...keyNames.map(keyName => _.groupBy(items, item => item[keyName]?.toLowerCase())));
        });

        const locationData = { cities, states, countries, lookup };
        return { locationData };
    });

    const { is } = compose.make('is');
    const { arr } = compose.make('arr', { is });
    const { fun } = compose.make('fun', { is });

    compose.make('obj', { is, arr });
    compose.deep('str', { arr });
    compose.make('fsx');
    compose.make('fsp', { is });
    compose.asis('any');
    compose.make('geo', { arr });
    compose.make('bool');
    compose.make('path', { arr });
    compose.make('pipe', { is, fun });

    return compose.modules;

};

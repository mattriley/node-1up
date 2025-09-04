const fsLimits = require('./config/fs-limits');
const platformDefaults = require('./config/platform-defaults');

module.exports = {

    path: {
        delimiter: '/',
    },

    json: {
        indent: 4
    },

    array: {
        delimiter: ',',
        finalDelimiter: undefined // defaults to delimiter
    },

    locationData: {
        cities: [],
        states: [],
        countries: []
    },

    videoMajorBrands: ['mp42', 'qt', 'isom'],
    videoFileTypes: ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'mts', 'm4v'],

    path: {
        fsLimits,
        platformDefaults
    }

};

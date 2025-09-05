const fileSystemLimits = require('./config/os-file-system-limits');
const platformDefaults = require('./config/os-platform-defaults');

module.exports = {

    path: {
        delimiter: '/'
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

    exif: {
        smartMakes: [
            'apple', 'samsung', 'google', 'xiaomi', 'huawei', 'oneplus', 'oppo', 'vivo',
            'nokia', 'sony', 'motorola', 'lg', 'zte', 'meizu', 'realme', 'asus'
        ],
        cameraMakes: [
            'canon', 'nikon', 'fujifilm', 'panasonic', 'olympus',
            'leica', 'pentax', 'ricoh', 'sigma', 'hasselblad'
        ],
        videoMajorBrands: ['mp42', 'qt', 'isom'],
        videoFileTypes: ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'mts', 'm4v'],
    },

    os: {
        fileSystemLimits,
        platformDefaults,
    }

};

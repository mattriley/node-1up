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
        cameraMakes: [
            'canon', 'nikon', 'fujifilm', 'panasonic', 'olympus',
            'leica', 'pentax', 'ricoh', 'sigma', 'hasselblad'
        ],
        // Each entry: [model keyword, expected make]
        smartModels: [
            ['iphone', 'apple'],
            ['ipad', 'apple'],
            ['pixel', 'google'],
            ['nexus', 'google'],
            ['galaxy', 'samsung'],
            ['redmi', 'xiaomi'],
            ['mi', 'xiaomi'],
            ['mix', 'xiaomi'],
            ['poco', 'xiaomi'],
            ['oneplus', 'oneplus'],
            ['xperia', 'sony'],
            ['moto', 'motorola'],
            ['mate', 'huawei'],
            ['nova', 'huawei'],
            ['honor', 'huawei'],
            ['realme', 'realme'],
            ['oppo', 'oppo'],
            ['vivo', 'vivo'],
            ['zenfone', 'asus']
        ],
        mobileSoftware: [
            'ios', 'ipad os', 'android',
            'miui', 'one ui', 'coloros', 'oxygenos', 'funtouch', 'emui'
        ],
        videoMajorBrands: ['mp42', 'qt', 'isom'],
        videoFileTypes: ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'mts', 'm4v'],
    },

    os: {
        fileSystemLimits,
        platformDefaults,
    }

};

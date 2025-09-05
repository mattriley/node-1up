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
        smartModels: [
            // Apple
            'iphone',
            'ipad',

            // Google
            'pixel',
            'nexus',

            // Samsung
            'galaxy',

            // Xiaomi / Redmi / Poco / Mi / Mix
            'redmi',
            'mi',
            'mix',
            'poco',

            // OnePlus
            'oneplus',

            // Sony
            'xperia',

            // Motorola
            'moto',

            // Huawei / Honor
            'mate',
            'nova',
            'honor',

            // Oppo / Realme / Vivo
            'realme',
            'oppo',
            'vivo',

            // Asus
            'zenfone'
        ],
        mobileSoftware: [
            // Core OS
            'ios',
            'ipad os',
            'android',

            // Common Android skins
            'miui',        // Xiaomi
            'one ui',      // Samsung
            'coloros',     // Oppo
            'oxygenos',    // OnePlus
            'funtouch',    // Vivo
            'emui'         // Huawei
        ],
        videoMajorBrands: ['mp42', 'qt', 'isom'],
        videoFileTypes: ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'mts', 'm4v'],
    },

    os: {
        fileSystemLimits,
        platformDefaults,
    }

};

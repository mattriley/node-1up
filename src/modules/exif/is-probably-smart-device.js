module.exports = ({ config }) => {

    const smartDeviceBrands = config.smartDeviceBrands.map(make => make.toLowerCase());
    const smartDeviceLookup = new Set(smartDeviceBrands);

    return ({ exif }) => {

        const make = (exif.Make ?? '').toLowerCase();
        const model = (exif.Model ?? '').toLowerCase();

        // Fast path: exact match
        let isSmart = smartDeviceLookup.has(make);

        // Fallback: slower substring scan on both make and model
        if (!isSmart) {
            isSmart = smartDeviceBrands.some(brand =>
                make.includes(brand) || model.includes(brand)
            );
        }

        const hasGps = 'GPSLatitude' in exif || 'GPSLongitude' in exif;
        const smallSensor = (exif.ExifImageWidth || 0) <= 4608;

        return isSmart || (hasGps && smallSensor && make && model);
    };
};

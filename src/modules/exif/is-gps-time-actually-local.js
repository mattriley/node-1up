module.exports = () => ({ exif }) => {

    const make = exif.Make;
    const model = exif.Model;

    if (!make || !model) return false;

    const normMake = make.trim().toLowerCase();
    const normModel = model.trim().toLowerCase();

    // iPhones up to ~iOS 10 (e.g., iPhone 5, 6, SE 1st gen) are known to store GPS time in local time
    const appleDevicesWithBrokenGpsUtc = [
        'iphone 4', 'iphone 4s', 'iphone 5', 'iphone 5s', 'iphone 5c',
        'iphone 6', 'iphone 6s', 'iphone se'
    ];

    const isApple = normMake.includes('apple') || normModel.includes('iphone');

    const isOldIphone = appleDevicesWithBrokenGpsUtc.some(m => normModel.includes(m));

    return isApple && isOldIphone;

}

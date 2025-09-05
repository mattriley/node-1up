module.exports = ({ test, assert }) => $ => {

    test('Cheap positive via Make (derived smart makes) & strong negative via camera make', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Apple' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'SAMSUNG' } }), true); // case-insensitive
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Canon' } }), false);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'NIKON' } }), false);  // case-insensitive
    });

    test('Model match when Make is missing', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Model: 'iPhone 12 Pro' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Model: 'Pixel 7' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Model: 'Xperia 10' } }), true);
    });

    test('Model present with consistent Make → smart', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'samsung', Model: 'Galaxy S21' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Sony', Model: 'XPERIA 5' } }), true);
    });

    test('Model present with conflicting camera Make and no other signals → not smart', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Canon', Model: 'Galaxy S21' } }), false);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Nikon', Model: 'iPhone 14' } }), false);
    });

    test('Model present with conflicting camera Make but Software confirms mobile → smart', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Canon', Model: 'Galaxy', Software: 'One UI 5' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'Nikon', Model: 'iPhone', Software: 'iOS 16.1' } }), true);
    });

    test('Software indicates mobile OS / skin (Software-only)', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'Android 13' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'mIuI 14' } }), true);     // case-insensitive
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'OxygenOS 13' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'ColorOS' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'Final Cut Pro' } }), false); // non-mobile software
    });

    test('GPS + optics fallback (phone-like focal lengths only when GPS exists)', () => {
        // Phone-like focal length + GPS → smart
        assert.equal($.exif.isSmartDevice({
            exif: { GPSLatitude: -37.8, GPSLongitude: 144.9, FocalLength: '4.2 mm' }
        }), true);

        // 35mm equivalent in phone range + GPS → smart
        assert.equal($.exif.isSmartDevice({
            exif: { GPSLatitude: 1, GPSLongitude: 2, FocalLengthIn35mmFormat: '26 mm' }
        }), true);

        // Not phone-like focal length + GPS → not smart
        assert.equal($.exif.isSmartDevice({
            exif: { GPSLatitude: 1, GPSLongitude: 2, FocalLength: '50 mm' }
        }), false);

        // Phone-like focal length but NO GPS → not smart (fallback requires GPS present)
        assert.equal($.exif.isSmartDevice({
            exif: { FocalLength: '4.2 mm' }
        }), false);
    });

    test('Case-insensitive matching across Make, Model, and Software', () => {
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'SoNy', Model: 'XPERIA 10' } }), true);
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'CANON', Model: 'EOS 80D' } }), false);
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'One Ui 6' } }), true);
    });

    test('Ambiguous or generic Make: rely on Model/Software/optics', () => {
        // Unknown make but model shows phone
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'ShenzhenCo', Model: 'Pixel 6a' } }), true);
        // Unknown everything and no GPS → not smart
        assert.equal($.exif.isSmartDevice({ exif: { Make: 'ShenzhenCo' } }), false);
    });

    test('Both Make and Model missing → Software or optics decide', () => {
        // Software-only
        assert.equal($.exif.isSmartDevice({ exif: { Software: 'Android 12' } }), true);
        // Optics fallback with GPS
        assert.equal($.exif.isSmartDevice({ exif: { GPSLatitude: 0, GPSLongitude: 0, FocalLengthIn35mmFormat: '24 mm' } }), true);
        // Nothing useful
        assert.equal($.exif.isSmartDevice({ exif: {} }), false);
    });

    test('Null/undefined EXIF handled safely', () => {
        // Function should not throw; normalize null/undefined to {}
        assert.equal($.exif.isSmartDevice({}), false);
        assert.equal($.exif.isSmartDevice({ exif: null }), false);
        assert.equal($.exif.isSmartDevice({ exif: undefined }), false);
    });

    test('Edge cases: weird values and types', () => {
        // Non-string Make/Model should not throw; coerce safely
        assert.equal($.exif.isSmartDevice({ exif: { Make: 123, Model: 456 } }), false);
        // Focal strings with units/extra text parsed by parseFloat
        assert.equal($.exif.isSmartDevice({
            exif: { GPSLatitude: 1, GPSLongitude: 1, FocalLength: '4.0mm (equiv: 26mm)' }
        }), true);
    });

};

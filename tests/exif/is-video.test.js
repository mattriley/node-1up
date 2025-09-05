// tests/exif/is-video.test.js
module.exports = ({ test, assert }) => $ => {

    const fn = $.exif.isVideo;

    test('Returns false when EXIF is missing or empty', () => {
        assert.equal(fn({}), false);
        assert.equal(fn({ exif: {} }), false);
    });

    test('Duration-only → video', () => {
        assert.equal(fn({ exif: { Duration: 12.34 } }), true);
    });

    test('VideoFrameRate-only → video', () => {
        assert.equal(fn({ exif: { VideoFrameRate: 29.97 } }), true);
    });

    test('MIMEType video/* → video (case-sensitive, expects "video/")', () => {
        assert.equal(fn({ exif: { MIMEType: 'video/mp4' } }), true);
        // Current implementation is case-sensitive on startsWith('video/')
        assert.equal(fn({ exif: { MIMEType: 'Video/mp4' } }), false);
        assert.equal(fn({ exif: { MIMEType: 'audio/mp3' } }), false);
        assert.equal(fn({ exif: { MIMEType: 'image/jpeg' } }), false);
    });

    test('FileType in configured video list → video (case-insensitive via toLowerCase)', () => {
        assert.equal(fn({ exif: { FileType: 'mp4' } }), true);
        assert.equal(fn({ exif: { FileType: 'MP4' } }), true);
        assert.equal(fn({ exif: { FileType: 'mKv' } }), true);
        assert.equal(fn({ exif: { FileType: 'jpg' } }), false);
    });

    test('MajorBrand in configured video brands → video (case-insensitive via toLowerCase)', () => {
        assert.equal(fn({ exif: { MajorBrand: 'isom' } }), true);
        assert.equal(fn({ exif: { MajorBrand: 'MP42' } }), true);
        assert.equal(fn({ exif: { MajorBrand: 'qt' } }), true);
        assert.equal(fn({ exif: { MajorBrand: 'jpeg' } }), false);
    });

    test('Any single positive signal is enough (logical OR semantics)', () => {
        // Non-video MIME, but video FileType → still video
        assert.equal(fn({ exif: { MIMEType: 'image/jpeg', FileType: 'mp4' } }), true);
        // Non-video MIME, non-video FileType, but MajorBrand video → still video
        assert.equal(fn({ exif: { MIMEType: 'application/octet-stream', FileType: 'bin', MajorBrand: 'isom' } }), true);
        // No MIME, no MajorBrand, but has frame rate → video
        assert.equal(fn({ exif: { VideoFrameRate: 60 } }), true);
    });

    test('Zero/edge numeric values: presence of key is enough', () => {
        // Even 0 duration or 0 fps still means the key is present → considered video by current logic
        assert.equal(fn({ exif: { Duration: 0 } }), true);
        assert.equal(fn({ exif: { VideoFrameRate: 0 } }), true);
    });

    test('Non-string FileType/MajorBrand would throw if present; omit or use strings only', () => {
        // Current implementation calls toLowerCase() directly, so only test with strings.
        // This assertion just documents expected safe behavior:
        assert.equal(fn({ exif: { FileType: 'mp4', MajorBrand: 'isom' } }), true);
    });

};

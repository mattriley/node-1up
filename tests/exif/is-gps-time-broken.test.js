module.exports = ({ test, assert }) => $ => {

    const fn = $.exif.isGpsTimeBroken;

    test('Returns false when required EXIF fields are missing', () => {
        assert.equal(fn({ exif: {} }), false);
        assert.equal(fn({ exif: { GPSDateStamp: '2025-09-05' } }), false);
        assert.equal(fn({ exif: { GPSTimeStamp: '03:00:00' } }), false);
        assert.equal(fn({ exif: { GPSDateStamp: '2025-09-05', GPSTimeStamp: '03:00:00' } }), false);
        assert.equal(fn({ exif: { GPSDateStamp: '2025-09-05', GPSTimeStamp: '03:00:00', DateTimeOriginal: '2025-09-05T13:00:00' } }), false);
    });

    test('Matching offset (+10:00) → not broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',                // 03:00Z
            DateTimeOriginal: '2025-09-05T13:00:00', // local = Z + 10h
            OffsetTimeOriginal: '+10:00'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Matching negative offset (-05:30) → not broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '12:00:00',                 // 12:00Z
            DateTimeOriginal: '2025-09-05T06:30:00',  // local = Z - 5h30
            OffsetTimeOriginal: '-05:30'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Zero offset (+00:00) → not broken when local equals UTC', () => {
        const exif = {
            GPSDateStamp: '2025-01-01',
            GPSTimeStamp: '00:15:00',                 // 00:15Z
            DateTimeOriginal: '2025-01-01T00:15:00',  // local = Z
            OffsetTimeOriginal: '+00:00'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Offset mismatch (>5 min) → broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',                // 03:00Z
            DateTimeOriginal: '2025-09-05T12:00:00', // actual offset = +9h, but says +10:00
            OffsetTimeOriginal: '+10:00'
        };
        assert.equal(fn({ exif }), true);
    });

    test('Boundary drift: exactly 5 minutes → not broken; 6 minutes → broken', () => {
        const exifNotBroken = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T12:55:00', // +9h55m vs +10:00 → diff 5m
            OffsetTimeOriginal: '+10:00'
        };
        const exifBroken = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T12:54:00', // +9h54m vs +10:00 → diff 6m
            OffsetTimeOriginal: '+10:00'
        };
        assert.equal(fn({ exif: exifNotBroken }), false);
        assert.equal(fn({ exif: exifBroken }), true);
    });

    test('Malformed/empty OffsetTimeOriginal → treated as absent → not broken', () => {
        const empty = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T13:00:00',
            OffsetTimeOriginal: ''
        };
        const whitespace = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T13:00:00',
            OffsetTimeOriginal: '   '
        };
        const malformed1 = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T13:00:00',
            OffsetTimeOriginal: 'UTC+10'
        };
        const malformed2 = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '03:00:00',
            DateTimeOriginal: '2025-09-05T13:00:00',
            OffsetTimeOriginal: '+1000' // missing colon, does not match /([+-])(\d{2}):(\d{2})/
        };
        assert.equal(fn({ exif: empty }), false);
        assert.equal(fn({ exif: whitespace }), false);
        assert.equal(fn({ exif: malformed1 }), false);
        assert.equal(fn({ exif: malformed2 }), false);
    });

    test('Fractional seconds in GPSTimeStamp → still parsed; matching offset → not broken', () => {
        const exif = {
            GPSDateStamp: '2025-04-10',
            GPSTimeStamp: '08:30:00.000',             // 08:30:00Z (fractional ok for Date)
            DateTimeOriginal: '2025-04-10T18:00:00',  // +9h30m
            OffsetTimeOriginal: '+09:30'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Non-hour offset (+09:45) → not broken when it matches', () => {
        const exif = {
            GPSDateStamp: '2025-07-01',
            GPSTimeStamp: '10:00:00',
            DateTimeOriginal: '2025-07-01T19:45:00',
            OffsetTimeOriginal: '+09:45'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Across midnight (forward) with correct offset → not broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '23:30:00',                 // 23:30Z
            DateTimeOriginal: '2025-09-06T09:30:00',  // +10h on next day
            OffsetTimeOriginal: '+10:00'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Across midnight (forward) with wrong offset → broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-05',
            GPSTimeStamp: '23:30:00',                 // 23:30Z
            DateTimeOriginal: '2025-09-06T08:30:00',  // +9h, says +10:00
            OffsetTimeOriginal: '+10:00'
        };
        assert.equal(fn({ exif }), true);
    });

    test('Across midnight (backward) with correct negative offset → not broken', () => {
        const exif = {
            GPSDateStamp: '2025-09-06',
            GPSTimeStamp: '01:15:00',                 // 01:15Z
            DateTimeOriginal: '2025-09-05T20:45:00',  // -4h30 → previous day
            OffsetTimeOriginal: '-04:30'
        };
        assert.equal(fn({ exif }), false);
    });

    test('Invalid DateTimeOriginal or GPS fields → actualOffset NaN → not broken', () => {
        const exif1 = { GPSDateStamp: 'not-a-date', GPSTimeStamp: '03:00:00', DateTimeOriginal: '2025-09-05T13:00:00', OffsetTimeOriginal: '+10:00' };
        const exif2 = { GPSDateStamp: '2025-09-05', GPSTimeStamp: 'not-a-time', DateTimeOriginal: '2025-09-05T13:00:00', OffsetTimeOriginal: '+10:00' };
        const exif3 = { GPSDateStamp: '2025-09-05', GPSTimeStamp: '03:00:00', DateTimeOriginal: 'invalid', OffsetTimeOriginal: '+10:00' };
        assert.equal(fn({ exif: exif1 }), false);
        assert.equal(fn({ exif: exif2 }), false);
        assert.equal(fn({ exif: exif3 }), false);
    });

};

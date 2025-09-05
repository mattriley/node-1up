// tests/exif/duration-seconds.test.js
module.exports = ({ test, assert }) => $ => {

    const fn = $.exif.durationInSeconds;

    // ---------- Basics / presence ----------
    test('Returns undefined when EXIF is missing or Duration absent', () => {
        assert.equal(fn({}), undefined);
        assert.equal(fn({ exif: {} }), undefined);
        assert.equal(fn({ exif: { Duration: null } }), undefined);
        assert.equal(fn({ exif: { Duration: undefined } }), undefined);
        // empty string → Number('') === 0 in vanilla JS, but our parser treats as invalid
        assert.equal(fn({ exif: { Duration: '' } }), undefined);
        assert.equal(fn({ exif: { Duration: '   ' } }), undefined);
    });

    // ---------- Numeric values ----------
    test('Numeric Duration (integer/float)', () => {
        assert.equal(fn({ exif: { Duration: 0 } }), 0);
        assert.equal(fn({ exif: { Duration: 1 } }), 1);
        assert.equal(fn({ exif: { Duration: 1.01 } }), 2); // ceil
        assert.equal(fn({ exif: { Duration: 59.001 } }), 60);
        assert.equal(fn({ exif: { Duration: -1.2 } }), -1); // current behavior: negatives are allowed and ceiled
    });

    // ---------- Plain numeric strings ----------
    test('Plain numeric string', () => {
        assert.equal(fn({ exif: { Duration: '0' } }), 0);
        assert.equal(fn({ exif: { Duration: '59' } }), 59);
        assert.equal(fn({ exif: { Duration: '59.1' } }), 60);
        assert.equal(fn({ exif: { Duration: '  2.000  ' } }), 2);
        assert.equal(fn({ exif: { Duration: 'NaN' } }), undefined);
        assert.equal(fn({ exif: { Duration: 'abc' } }), undefined);
    });

    // ---------- With unit suffixes ----------
    test('Unit-suffixed strings (ms / s / sec / seconds / m / min / minutes / h / hr / hours)', () => {
        // ms → seconds
        assert.equal(fn({ exif: { Duration: '750 ms' } }), 1);
        assert.equal(fn({ exif: { Duration: '1000ms' } }), 1);
        assert.equal(fn({ exif: { Duration: '1.5 ms' } }), 1);  // 0.0015s → ceil → 1

        // seconds forms
        assert.equal(fn({ exif: { Duration: '1 s' } }), 1);
        assert.equal(fn({ exif: { Duration: '1sec' } }), 1);
        assert.equal(fn({ exif: { Duration: '1.1 seconds' } }), 2);

        // minutes forms
        assert.equal(fn({ exif: { Duration: '1 m' } }), 60);
        assert.equal(fn({ exif: { Duration: '1min' } }), 60);
        assert.equal(fn({ exif: { Duration: '1.5 minutes' } }), 90);

        // hours forms
        assert.equal(fn({ exif: { Duration: '1 h' } }), 3600);
        assert.equal(fn({ exif: { Duration: '1hr' } }), 3600);
        assert.equal(fn({ exif: { Duration: '1.25 hours' } }), 4500);

        // casing + whitespace tolerant
        assert.equal(fn({ exif: { Duration: '  2.5   HoUrS  ' } }), 9000);
        assert.equal(fn({ exif: { Duration: '  90   Min  ' } }), 5400);
        assert.equal(fn({ exif: { Duration: '  120  s ' } }), 120);
    });

    // ---------- ISO-8601 PT… strings ----------
    test('ISO-8601-like durations (PT…)', () => {
        assert.equal(fn({ exif: { Duration: 'PT30S' } }), 30);
        assert.equal(fn({ exif: { Duration: 'PT1M' } }), 60);
        assert.equal(fn({ exif: { Duration: 'PT1H' } }), 3600);
        assert.equal(fn({ exif: { Duration: 'PT1H2M3S' } }), 3723);
        assert.equal(fn({ exif: { Duration: 'PT1.5H' } }), 5400);   // fractional hours
        assert.equal(fn({ exif: { Duration: 'PT2.25M' } }), 135);   // fractional minutes
        assert.equal(fn({ exif: { Duration: 'PT3.5S' } }), 4);      // fractional seconds → ceil

        // lower/upper case tolerant
        assert.equal(fn({ exif: { Duration: 'pt10s' } }), 10);

        // invalid ISO returns undefined
        assert.equal(fn({ exif: { Duration: 'P1DT2H' } }), undefined);  // days not supported by minimal parser
        assert.equal(fn({ exif: { Duration: 'PT' } }), undefined);
    });

    // ---------- Colon time formats ----------
    test('Colon time HH:MM and HH:MM:SS[.sss]', () => {
        // HH:MM (no seconds) — treated as HH:MM:00
        assert.equal(fn({ exif: { Duration: '00:00' } }), 0);
        assert.equal(fn({ exif: { Duration: '00:59' } }), 3540);
        assert.equal(fn({ exif: { Duration: '01:00' } }), 3600);
        assert.equal(fn({ exif: { Duration: '10:05' } }), 36300);

        // HH:MM:SS
        assert.equal(fn({ exif: { Duration: '00:00:59' } }), 59);
        assert.equal(fn({ exif: { Duration: '00:00:59.1' } }), 60);   // fractional seconds allowed
        assert.equal(fn({ exif: { Duration: '01:02:03' } }), 3723);

        // invalid minute/second ranges
        assert.equal(fn({ exif: { Duration: '00:60' } }), undefined);
        assert.equal(fn({ exif: { Duration: '00:00:60' } }), undefined);

        // whitespace tolerant
        assert.equal(fn({ exif: { Duration: '   02:03   ' } }), 7380);
        assert.equal(fn({ exif: { Duration: '  04:05:06.50  ' } }), 14707);
    });

    // ---------- Specific EXIF-style strings you used originally ----------
    test('EXIF-formatted seconds with trailing " s"', () => {
        assert.equal(fn({ exif: { Duration: '1 s' } }), 1);
        assert.equal(fn({ exif: { Duration: '1.01 s' } }), 2);
        assert.equal(fn({ exif: { Duration: '59.001 s' } }), 60);
        // casing: parser is case-insensitive for unit forms, but this literal branch was exact; improved parser handles both
        assert.equal(fn({ exif: { Duration: '  42 S ' } }), 42);
    });

    // ---------- Invalid inputs remain undefined ----------
    test('Invalid / unsupported strings', () => {
        assert.equal(fn({ exif: { Duration: 'hello world' } }), undefined);
        assert.equal(fn({ exif: { Duration: 'P2D' } }), undefined); // days not supported by minimal ISO parser
        assert.equal(fn({ exif: { Duration: '1 day' } }), undefined);
        assert.equal(fn({ exif: { Duration: 'min 10' } }), undefined); // wrong order
    });

    // ---------- Boundary and rounding ----------
    test('Rounding behavior (ceil)', () => {
        assert.equal(fn({ exif: { Duration: 1.000 } }), 1);
        assert.equal(fn({ exif: { Duration: 1.00001 } }), 2);
        assert.equal(fn({ exif: { Duration: '59.000' } }), 59);
        assert.equal(fn({ exif: { Duration: '59.0001' } }), 60);
    });

    // ---------- Robustness / whitespace and mixed cases ----------
    test('Whitespace, casing, and mixed formats', () => {
        assert.equal(fn({ exif: { Duration: '   PT1H  ' } }), 3600);
        assert.equal(fn({ exif: { Duration: '  90   minutes  ' } }), 5400);
        assert.equal(fn({ exif: { Duration: '  1.25   HOURS ' } }), 4500);
        assert.equal(fn({ exif: { Duration: '  600   s ' } }), 600);
    });

};

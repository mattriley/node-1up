module.exports = ({ test, assert }) => lib => {

    const fn = lib.date.batchParse;

    // Helpers
    const expectIsoNoZone = (iso, ymd, hms = '00:00:00') => {
        assert.strictEqual(iso, `${ymd}T${hms}`);
    };
    const expectIsoWithOffset = (iso, ymd, hms) => {
        const re = new RegExp(`^${ymd}T${hms}(Z|[+-]\\d{2}:\\d{2})$`);
        assert.ok(re.test(iso), `Expected ISO with offset for ${ymd}T${hms}, got: ${iso}`);
    };

    test('date only, no timezone → UTC fallback & no zone in output', () => {
        const data = { d: '2024-03-05' }; // no data.tz
        const res = fn({ data, sources: ['d'], timezoneSource: 'tz' });
        assert.equal(res.length, 1);
        const out = res[0];

        assert.ok(!out.error, `unexpected error: ${out && out.error}`);
        expectIsoNoZone(out.iso, '2024-03-05');
        assert.strictEqual(out.timezone, undefined);

        assert.strictEqual(out.debug.dateSource, 'd');
        assert.strictEqual(out.debug.sourceDate, '2024-03-05');
        assert.strictEqual(out.debug.timezoneForLuxon, 'UTC');
        assert.strictEqual(out.debug.isoForLuxon, '2024-03-05');
    });

    test('date + time with timezone → includes some offset', () => {
        const data = { d: '2024-01-02', t: '03:04:05', tz: 'Australia/Melbourne' };
        const res = fn({ data, sources: [['d', 't']], timezoneSource: 'tz' });
        const out = res[0];

        assert.ok(!out.error, `unexpected error: ${out && out.error}`);
        expectIsoWithOffset(out.iso, '2024-01-02', '03:04:05');
        assert.strictEqual(out.timezone, 'Australia/Melbourne');
        assert.strictEqual(out.debug.timezoneForLuxon, 'Australia/Melbourne');
        assert.strictEqual(out.debug.isoForLuxon, '2024-01-02T03:04:05');
    });

    test('whitespace date → "Date Source not found"', () => {
        const data = { d: '   ' };
        const res = fn({ data, sources: ['d'], timezoneSource: 'tz' });
        const out = res[0];

        assert.strictEqual(out.error, 'Date Source not found');
        assert.strictEqual(out.debug.dateSource, 'd');
        assert.strictEqual(out.debug.sourceDate, undefined);
        assert.strictEqual(out.debug.isoForLuxon, undefined);
    });

    test('timeSource provided but blank → "Time Source not found"', () => {
        const data = { d: '2024-05-06', t: '' };
        const res = fn({ data, sources: [['d', 't']], timezoneSource: 'tz' });
        const out = res[0];

        assert.strictEqual(out.error, 'Time Source not found');
        assert.strictEqual(out.debug.dateSource, 'd');
        assert.strictEqual(out.debug.timeSource, 't');
        assert.strictEqual(out.debug.sourceTime, undefined);
        assert.strictEqual(out.debug.isoForLuxon, undefined);
    });

    test('invalid ISO from toIso → exposes Luxon invalid explanation & isoForLuxon', () => {
        const data = { d: '2024-02-30' }; // invalid date
        const res = fn({
            data,
            sources: ['d'],
            timezoneSource: 'tz',
            toIso: (date) => date // pass-through
        });
        const out = res[0];

        assert.ok(out.error, 'expected an error from invalid date');
        assert.strictEqual(out.debug.isoForLuxon, '2024-02-30');
    });

    test('toIso throws → surfaces error & keeps debug context', () => {
        const data = { d: '2024-01-01' };
        const res = fn({
            data,
            sources: ['d'],
            timezoneSource: 'tz',
            toIso: () => { throw new Error('boom'); }
        });
        const out = res[0];

        assert.ok(out.error && out.error.includes('toIso failed: boom'), `Unexpected error: ${out.error}`);
        assert.strictEqual(out.debug.dateSource, 'd');
    });

    test('blank timezone → fallback to UTC (no zone in output)', () => {
        const data = { d: '2024-06-07', tz: '   ' };
        const res = fn({ data, sources: ['d'], timezoneSource: 'tz' });
        const out = res[0];

        assert.ok(!out.error);
        expectIsoNoZone(out.iso, '2024-06-07');
        assert.strictEqual(out.timezone, undefined);
        assert.strictEqual(out.debug.timezoneForLuxon, 'UTC');
    });

    test('accepts mixed sources: string and [date,time] tuple', () => {
        const data = { d1: '2024-08-09', d2: '2024-08-10', t2: '11:12:13' };
        const res = fn({ data, sources: ['d1', ['d2', 't2']], timezoneSource: 'tz' });

        assert.equal(res.length, 2);
        const [r1, r2] = res;

        expectIsoNoZone(r1.iso, '2024-08-09');
        assert.strictEqual(r1.debug.isoForLuxon, '2024-08-09');

        expectIsoNoZone(r2.iso, '2024-08-10', '11:12:13');
        assert.strictEqual(r2.debug.isoForLuxon, '2024-08-10T11:12:13');
    });

    test('trims inputs (date, time, timezone)', () => {
        const data = { d: ' 2024-09-01 ', t: ' 01:02:03 ', tz: ' Australia/Melbourne ' };
        const res = fn({ data, sources: [['d', 't']], timezoneSource: 'tz' });
        const out = res[0];

        assert.ok(!out.error);
        expectIsoWithOffset(out.iso, '2024-09-01', '01:02:03');
        assert.strictEqual(out.timezone, 'Australia/Melbourne');
        assert.strictEqual(out.debug.sourceDate, '2024-09-01');
        assert.strictEqual(out.debug.sourceTime, '01:02:03');
        assert.strictEqual(out.debug.timezone, 'Australia/Melbourne');
    });
};

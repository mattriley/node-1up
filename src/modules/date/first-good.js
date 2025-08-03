module.exports = $ => ({ data, sources, timezoneSource, toIso }) => {

    const candidates = $.date.batchParse({ data, sources, timezoneSource, toIso });
    const debug = { candidates };
    const firstGood = candidates.find(date => !date.error);
    if (!firstGood) return { debug, error: 'No good date found' };
    const { iso, timezone } = firstGood;
    return { iso, timezone, debug };

}

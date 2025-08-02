const { DateTime } = require('luxon');

const toIsoDefault = (date, time) => time ? `${date}T${time}` : date;

module.exports = $ => ({ data, sources, timezoneSource, toIso }) => {

    data ??= {};
    sources ??= [];
    toIso ??= toIsoDefault;
    const timezone = $.obj.dig(data, timezoneSource);
    const timezoneForLuxon = timezone ?? 'UTC';

    return sources.map(source => {
        const [dateSource, timeSource] = [source].flat();
        const sourceDate = $.obj.dig(data, dateSource);
        const sourceTime = timeSource ? $.obj.dig(data, timeSource) : undefined;

        if (dateSource && !sourceDate) return { dateSource, error: 'Date Source not found' };
        if (timeSource && !sourceTime) return { dateSource, sourceDate, timeSource, error: 'Time Source not found' };

        const isoForLuxon = toIso(sourceDate, sourceTime);

        const debug = {
            dateSource,
            sourceDate,
            timeSource,
            sourceTime,
            timezone,
            isoForLuxon,
            timezoneForLuxon
        };

        const dt = DateTime.fromISO(isoForLuxon, { zone: timezoneForLuxon });
        if (!dt.isValid) return { error: dt.invalidExplanation, debug };

        const iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
        return { iso, timezone, debug };
    });

};

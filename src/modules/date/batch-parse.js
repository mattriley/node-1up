const { DateTime } = require('luxon');

const toIsoDefault = (date, time) => (time ? `${date}T${time}` : date);

module.exports = ({ obj }) => ({ data, sources, timezoneSource, toIso }) => {
    data ??= {};
    sources ??= [];
    toIso ??= toIsoDefault;

    const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

    // Resolve timezone (optional). If empty/invalid, fall back to 'UTC'.
    const rawTimezone = obj.dig(data, timezoneSource);
    const timezone = isNonEmptyString(rawTimezone) ? rawTimezone.trim() : undefined;
    const timezoneForLuxon = timezone ?? 'UTC';

    // Normalize `sources`: each item can be 'datePath' or ['datePath', 'timePath']
    const normalized = sources.map((src) => {
        if (Array.isArray(src)) return [src[0], src[1]];
        return [src, undefined];
    });

    return normalized.map(([dateSource, timeSource]) => {
        // Read values (allow undefined for timeSource)
        const sourceDateRaw = obj.dig(data, dateSource);
        const sourceTimeRaw = timeSource ? obj.dig(data, timeSource) : undefined;

        const sourceDate = isNonEmptyString(sourceDateRaw) ? sourceDateRaw.trim() : '';
        const sourceTime = isNonEmptyString(sourceTimeRaw) ? sourceTimeRaw.trim() : '';

        const debug = {
            dateSource,
            sourceDate: sourceDate || undefined,
            timeSource,
            sourceTime: sourceTime || undefined,
            timezone,
            timezoneForLuxon
        };

        // Required fields checks
        if (!isNonEmptyString(dateSource)) {
            return { error: 'Date Source path missing', debug };
        }
        if (!sourceDate) {
            return { error: 'Date Source not found', debug };
        }
        if (timeSource && !sourceTime) {
            return { error: 'Time Source not found', debug };
        }

        // Compose ISO input for Luxon (caller can override via toIso)
        let isoForLuxon;
        try {
            isoForLuxon = toIso(sourceDate, sourceTime || undefined);
        } catch (e) {
            return { error: `toIso failed: ${e && e.message ? e.message : String(e)}`, debug: { ...debug, isoForLuxon } };
        }

        const dt = DateTime.fromISO(isoForLuxon, { zone: timezoneForLuxon });
        if (!dt.isValid) {
            return { error: dt.invalidExplanation || 'Invalid date/time', debug: { ...debug, isoForLuxon } };
        }

        // Output format:
        // - If a timezone was provided, emit full ISO with zone (no ms)
        // - If not, emit 'yyyy-MM-dd\'T\'HH:mm:ss' (no zone)
        const iso = timezone
            ? dt.toISO({ suppressMilliseconds: true })
            : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");

        return { iso, timezone, debug: { ...debug, isoForLuxon } };
    });
};

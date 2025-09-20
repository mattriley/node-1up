const toNum = v => {
    if (typeof v === 'number') { return v; }
    if (typeof v === 'string') { return Number(v); }
    return NaN;
};

const parseColonTime = str => {
    const parts = String(str).split(':');
    if (parts.length < 2 || parts.length > 3) { return NaN; }

    const [hRaw, mRaw, sRaw = '0'] = parts;
    const h = Number(hRaw);
    const m = Number(mRaw);
    const s = Number(sRaw);

    if (!Number.isFinite(h) || !Number.isFinite(m) || !Number.isFinite(s)) { return NaN; }
    if (m < 0 || m >= 60 || s < 0 || s >= 60) { return NaN; }

    return (h * 3600) + (m * 60) + s;
};

// Minimal ISO-8601 duration parser for PT… strings (hours/minutes/seconds only)
const parseIsoDuration = str => {
    const m = String(str).match(/^P(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)$/i);
    if (!m) { return NaN; }

    // NEW: require at least one of H/M/S to be present
    if (!m[1] && !m[2] && !m[3]) { return NaN; }

    const h = m[1] ? Number(m[1]) : 0;
    const mi = m[2] ? Number(m[2]) : 0;
    const s = m[3] ? Number(m[3]) : 0;

    if (!Number.isFinite(h) || !Number.isFinite(mi) || !Number.isFinite(s)) { return NaN; }
    return (h * 3600) + (mi * 60) + s;
};

// Parses strings like "1234", "1234 ms", "12.3s", "5 min", "1.5h"
const parseWithUnits = str => {
    const m = String(str).trim().match(/^(\d+(?:\.\d+)?)(?:\s*(ms|s|sec|seconds|m|min|minutes|h|hr|hours))?$/i);
    if (!m) { return NaN; }
    const n = Number(m[1]);
    if (!Number.isFinite(n)) { return NaN; }
    const unit = (m[2] || 's').toLowerCase();

    if (unit === 'ms') { return n / 1000; }
    if (unit === 's' || unit === 'sec' || unit === 'seconds') { return n; }
    if (unit === 'm' || unit === 'min' || unit === 'minutes') { return n * 60; }
    if (unit === 'h' || unit === 'hr' || unit === 'hours') { return n * 3600; }

    return NaN; // should not happen due to regex, but safe
};

module.exports = () => ({ exif = {} }) => {

    const { Duration } = exif;
    if (Duration == null) { return; }

    let seconds;

    if (typeof Duration === 'number') {
        seconds = Duration;
    } else if (typeof Duration === 'string') {
        const txt = Duration.trim();

        if (txt.includes(':')) {
            seconds = parseColonTime(txt);
        } else if (/^P/i.test(txt)) {
            seconds = parseIsoDuration(txt);
        } else {
            // handles "4.2 s", "4200 ms", "12.3", "5 min", "1.5h"
            seconds = parseWithUnits(txt);
        }
    } else {
        seconds = toNum(Duration);
    }

    if (!Number.isFinite(seconds)) { return; }

    return Math.ceil(seconds);

};

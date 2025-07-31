module.exports = () => ({ exif }) => {

    if (!exif?.GPSDateStamp || !exif?.GPSTimeStamp) return false;
    if (!exif.DateTimeOriginal) return false;

    // Parse GPS UTC time (trusted)
    const gpsDateTime = new Date(`${exif.GPSDateStamp}T${exif.GPSTimeStamp}Z`);
    const localDateTime = new Date(exif.DateTimeOriginal);

    // Determine UTC offset from EXIF
    let expectedOffset = null;
    if (exif.OffsetTimeOriginal) {
        const match = exif.OffsetTimeOriginal.match(/([+-])(\d{2}):(\d{2})/);
        if (match) {
            const [, sign, h, m] = match;
            const totalMinutes = Number(h) * 60 + Number(m);
            expectedOffset = (sign === '-' ? -1 : 1) * totalMinutes;
        }
    }

    // Compute the actual offset (local vs. GPS UTC)
    const actualOffset = Math.round((localDateTime - gpsDateTime) / 60000);

    // Consider it broken if the offset tag exists but doesn't match reality (allow 5 min drift)
    return expectedOffset !== null &&
        Math.abs(actualOffset - expectedOffset) > 5;
};

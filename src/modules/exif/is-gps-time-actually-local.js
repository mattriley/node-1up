module.exports = ({ config }) => ({ exif }) => {
    if (!exif?.Make || !exif?.Model) return false;

    const make = exif.Make.trim().toLowerCase();
    const model = exif.Model.trim().toLowerCase();

    const isKnownBrokenApple =
        make.includes('apple') &&
        config.appleDevicesWithBrokenGpsUtc.some(m => model.includes(m.toLowerCase()));

    // GPS UTC time (trusted)
    const gpsDateTime = new Date(`${exif.GPSDateStamp}T${exif.GPSTimeStamp}Z`);
    if (!exif.DateTimeOriginal) return isKnownBrokenApple;

    // Parse EXIF local time
    const localDateTime = new Date(exif.DateTimeOriginal);

    // Determine UTC offset from EXIF
    let expectedOffset = null;
    if (exif.OffsetTimeOriginal) {
        const [sign, h, m] = exif.OffsetTimeOriginal.match(/([+-])(\d{2}):(\d{2})/).slice(1);
        expectedOffset = (sign === '-' ? -1 : 1) * (Number(h) * 60 + Number(m));
    }

    // Compute actual offset difference between EXIF local and GPS UTC
    const actualOffset = Math.round((localDateTime - gpsDateTime) / 60000);

    // If an offset is recorded, check if it matches reality
    const offsetMismatch =
        expectedOffset !== null &&
        Math.abs(actualOffset - expectedOffset) > 5; // allow small drift

    // Final condition:
    //   - device is known broken OR
    //   - offset mismatch (phone wrote wrong offset vs actual difference)
    return isKnownBrokenApple || offsetMismatch;
};

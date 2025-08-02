module.exports = () => (gpsDate, gpsTime) => {

    const gpsDateAsIso = gpsDate.replaceAll(':', '-');
    const [h = 0, m = 0, s = 0] = gpsTime.map(Math.floor);
    const gpsTimeAsIso = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
    return `${gpsDateAsIso}T${gpsTimeAsIso}`;

};

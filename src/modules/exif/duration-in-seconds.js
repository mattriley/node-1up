const parseColonTime = str => {
    const [h = 0, m = 0, s = 0] = str.split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

module.exports = () => ({ exif = {} }) => {

    const { Duration } = exif;
    if (!Duration) return;

    let seconds;

    if (typeof Duration === 'string') {
        if (Duration.endsWith(' s')) {
            seconds = parseFloat(Duration.replace(' s', ''));
        } else if (Duration.includes(':')) {
            seconds = parseColonTime(Duration);
        } else {
            seconds = parseFloat(Duration);
        }
    } else {
        seconds = Number(Duration);
    }

    if (!Number.isFinite(seconds)) return;

    return Math.ceil(seconds);
};

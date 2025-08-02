const toIso = sourceDateTime => {
    let [date, time] = sourceDateTime.split(' ');
    date = date.replaceAll(':', '-');
    return `${date}T${time}`;
};

module.exports = $ => ({ data, sources, timezoneSource }) => {
    sources ??= ['exif.DateTimeOriginal'];
    return $.date.batchParse({ data, sources, timezoneSource, toIso });
};

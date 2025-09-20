module.exports = () => exifDate => {

    const [date, time] = exifDate.split(' ');
    const isoDate = date.replaceAll(':', '-');
    return `${isoDate}T${time}`;

};

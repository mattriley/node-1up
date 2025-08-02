module.exports = () => exifDate => {

    let [date, time] = exifDate.split(' ');
    date = date.replaceAll(':', '-');
    return `${date}T${time}`;

};

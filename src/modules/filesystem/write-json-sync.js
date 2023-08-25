module.exports = ({ fs }) => (path, data, space = 2) => {

    return fs.writeFileSync(path, JSON.stringify(data, null, space));

};

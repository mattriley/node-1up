module.exports = ({ fs }) => path => {

    return JSON.parse(fs.readFileSync(path, 'utf-8'));

};

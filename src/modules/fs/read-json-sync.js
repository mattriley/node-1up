module.exports = ({ self }) => path => {

    const json = self.nodefs.readFileSync(path, 'utf8');
    return JSON.parse(json);

};

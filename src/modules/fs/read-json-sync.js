module.exports = ({ io }) => path => {

    const json = io.fs.readFileSync(path, 'utf8');
    return JSON.parse(json);

};

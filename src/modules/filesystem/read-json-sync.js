module.exports = ({ io }) => path => {

    return JSON.parse(io.fs.readFileSync(path, 'utf-8'));

};

module.exports = ({ fsp }) => dirpath => {

    return fsp.mkdir(dirpath, { recursive: true });

};

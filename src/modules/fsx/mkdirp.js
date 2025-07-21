module.exports = ({ fsp }) => dirPath => {

    return fsp.mkdir(dirPath, { recursive: true });

};

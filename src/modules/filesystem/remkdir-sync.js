module.exports = ({ fs }) => (path, options = {}) => {

    const { recursive = true, force = true } = options;
    fs.rmSync(path, { recursive, force });
    fs.mkdirSync(path, { recursive });

};

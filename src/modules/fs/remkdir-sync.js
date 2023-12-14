module.exports = ({ io }) => (path, options = {}) => {

    const { recursive = true, force = true } = options;
    io.fs.rmSync(path, { recursive, force });
    io.fs.mkdirSync(path, { recursive });

};

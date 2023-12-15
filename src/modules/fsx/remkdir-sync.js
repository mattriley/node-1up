module.exports = ({ self }) => (path, options = {}) => {

    const { recursive = true, force = true } = options;
    self.nodefs.rmSync(path, { recursive, force });
    self.nodefs.mkdirSync(path, { recursive });

};

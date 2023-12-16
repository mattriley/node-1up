module.exports = ({ self }) => async (path, options = {}) => {

    const { recursive = true, force = true } = options;
    self.nodefs.rmSync(path, { recursive, force });
    await self.nodefs.promises.mkdir(path, { recursive });

};

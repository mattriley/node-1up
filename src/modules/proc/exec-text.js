module.exports = ({ self }) => async (cmd, options = {}) => {

    const { stdout } = await self.exec(cmd, options);
    return stdout;

};

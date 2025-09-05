module.exports = ({ self }) => async (cmd, options = {}) => {

    const txt = await self.execText(cmd, options);

    try {
        return JSON.parse(txt);
    } catch (e) {
        const err = new Error(`Failed to parse JSON from command: ${cmd}\n${e.message}`);
        err.name = 'ExecJsonError';
        err.cmd = cmd;
        err.output = txt;
        throw err;
    }

};

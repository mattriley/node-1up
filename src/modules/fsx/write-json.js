module.exports = ({ fsp, config }) => async (filepath, data, indent = config.indent) => {

    try {
        const json = JSON.stringify(data, null, indent);
        await fsp.writeFile(filepath, json);
    } catch (err) {
        err.data = { filepath };
    }

};

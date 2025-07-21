module.exports = ({ fsp }) => async filepath => {

    try {
        const json = await fsp.readFile(filepath, 'utf8');
        return JSON.parse(json);
    } catch (err) {
        err.data = { filepath };
        throw err;
    }

};

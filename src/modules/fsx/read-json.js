module.exports = ({ fsp }) => async filepath => {

    const json = await fsp.readFile(filepath, 'utf8');
    return JSON.parse(json);

};

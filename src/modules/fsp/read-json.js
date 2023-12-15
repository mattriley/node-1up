module.exports = ({ self }) => async path => {

    const json = await self.nodefs.promises.readFile(path, 'utf8');
    return JSON.parse(json);

};

module.exports = ({ fs }) => anypath => {

    const exists = fs.existsSync(anypath);
    if (!exists) throw new Error(`Path not found: ${anypath}`);

};

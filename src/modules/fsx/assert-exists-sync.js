module.exports = ({ fs }) => path => {

    const exists = fs.existsSync(path);
    if (!exists) throw new Error(`Path not found: ${path}`);

};

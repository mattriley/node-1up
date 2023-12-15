module.exports = ({ self }) => path => {

    const exists = self.nodefs.existsSync(path);
    if (!exists) throw new Error(`Path not found: ${path}`);

};

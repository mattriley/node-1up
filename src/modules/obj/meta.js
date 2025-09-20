module.exports = ({ self }) => {

    const configure = self.metaConfigure;
    const meta = configure();
    return Object.assign(meta, { configure });

};

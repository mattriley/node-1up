module.exports = ({ self }) => {

    const configure = self.omitConfigure;
    const omit = configure();
    return Object.assign(omit, { configure });

};

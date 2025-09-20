module.exports = ({ self }) => {

    const configure = self.indentConfigure;
    const indent = configure();
    return Object.assign(indent, { configure });

};

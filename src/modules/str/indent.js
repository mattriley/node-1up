module.exports = ({ self }) => {

    const indent = self.indentConfigure();
    indent.configure = self.indentConfigure;
    return indent;

}

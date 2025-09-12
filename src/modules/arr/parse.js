module.exports = ({ self }) => {

    const parse = self.parseConfigure();
    parse.configure = self.configure;
    return parse;

};
